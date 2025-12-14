using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.EventApps;
using Nory.Application.Services;
using Nory.Infrastructure.Persistence;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Services;

public class EventAppService : IEventAppService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<EventAppService> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public EventAppService(ApplicationDbContext context, ILogger<EventAppService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .AsNoTracking()
            .AnyAsync(e => e.Id == eventId, cancellationToken);
    }

    public async Task<IReadOnlyList<EventAppDto>> GetEventAppsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting apps for event {EventId}", eventId);

        var eventEntity = await _context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity is null)
        {
            return Array.Empty<EventAppDto>();
        }

        var apps = new List<EventAppDto>();

        // Get apps from EventApps table
        var eventApps = await GetAppsFromDatabaseAsync(eventId, cancellationToken);
        apps.AddRange(eventApps);

        // Get apps from GuestAppConfig (GuestAppBuilder system)
        var guestApps = await GetAppsFromGuestAppConfigAsync(eventEntity.GuestAppConfig, cancellationToken);
        apps.AddRange(guestApps);

        _logger.LogInformation("Returning {Count} apps for event {EventId}", apps.Count, eventId);
        return apps;
    }

    public async Task<EventAppDto?> GetEventAppAsync(Guid eventId, string appId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting app {AppId} for event {EventId}", appId, eventId);

        // Try to find in EventApps table first
        if (Guid.TryParse(appId, out var appGuid))
        {
            var app = await _context.EventApps
                .AsNoTracking()
                .Include(ea => ea.AppType)
                .FirstOrDefaultAsync(
                    ea => ea.Id == appGuid && ea.EventId == eventId && ea.IsEnabled,
                    cancellationToken);

            if (app?.AppType != null && app.AppType.IsActive)
            {
                return MapToDto(app);
            }
        }

        // Try to find in GuestAppConfig
        var eventEntity = await _context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity?.GuestAppConfig is null)
        {
            return null;
        }

        return await FindAppInGuestAppConfigAsync(eventEntity.GuestAppConfig, appId, cancellationToken);
    }

    private async Task<IReadOnlyList<EventAppDto>> GetAppsFromDatabaseAsync(Guid eventId, CancellationToken cancellationToken)
    {
        return await _context.EventApps
            .AsNoTracking()
            .Include(ea => ea.AppType)
            .Where(ea => ea.EventId == eventId && ea.IsEnabled && ea.AppType != null && ea.AppType.IsActive)
            .OrderBy(ea => ea.SortOrder)
            .Select(ea => new EventAppDto
            {
                Id = ea.Id.ToString(),
                AppType = new AppTypeDto
                {
                    Id = ea.AppType!.Id,
                    Name = ea.AppType.Name,
                    Description = ea.AppType.Description,
                    Component = ea.AppType.Component,
                    Icon = ea.AppType.Icon,
                    Color = ea.AppType.Color
                },
                Configuration = ea.Configuration,
                SortOrder = ea.SortOrder
            })
            .ToListAsync(cancellationToken);
    }

    private async Task<IReadOnlyList<EventAppDto>> GetAppsFromGuestAppConfigAsync(
        Dictionary<string, object>? guestAppConfig,
        CancellationToken cancellationToken)
    {
        if (guestAppConfig?.ContainsKey("components") != true)
        {
            return Array.Empty<EventAppDto>();
        }

        try
        {
            var components = ParseGuestAppComponents(guestAppConfig);
            if (components is null || components.Count == 0)
            {
                return Array.Empty<EventAppDto>();
            }

            _logger.LogInformation("Found {Count} components in GuestAppConfig", components.Count);

            var componentTypes = components
                .Where(c => c.Config?.Type != null)
                .Select(c => MapComponentTypeToAppTypeId(c.Config!.Type))
                .ToList();

            var appTypes = await _context.AppTypes
                .AsNoTracking()
                .Where(at => componentTypes.Contains(at.Id) && at.IsActive)
                .ToListAsync(cancellationToken);

            var apps = new List<EventAppDto>();

            foreach (var component in components)
            {
                var mappedTypeId = MapComponentTypeToAppTypeId(component.Config?.Type);
                var appType = appTypes.FirstOrDefault(at => at.Id == mappedTypeId);

                apps.Add(new EventAppDto
                {
                    Id = component.Id,
                    AppType = appType != null
                        ? new AppTypeDto
                        {
                            Id = appType.Id,
                            Name = appType.Name,
                            Description = appType.Description,
                            Component = appType.Component,
                            Icon = appType.Icon,
                            Color = appType.Color
                        }
                        : CreateFallbackAppType(component.Config?.Type),
                    Configuration = JsonSerializer.Serialize(component.Config),
                    SortOrder = component.Slot
                });
            }

            return apps;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse GuestAppConfig components");
            return Array.Empty<EventAppDto>();
        }
    }

    private async Task<EventAppDto?> FindAppInGuestAppConfigAsync(
        Dictionary<string, object> guestAppConfig,
        string appId,
        CancellationToken cancellationToken)
    {
        if (!guestAppConfig.ContainsKey("components"))
        {
            return null;
        }

        try
        {
            var components = ParseGuestAppComponents(guestAppConfig);
            var component = components?.FirstOrDefault(c => c.Id == appId);

            if (component is null)
            {
                return null;
            }

            var mappedTypeId = MapComponentTypeToAppTypeId(component.Config?.Type);
            var appType = await _context.AppTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(at => at.Id == mappedTypeId && at.IsActive, cancellationToken);

            return new EventAppDto
            {
                Id = component.Id,
                AppType = appType != null
                    ? new AppTypeDto
                    {
                        Id = appType.Id,
                        Name = appType.Name,
                        Description = appType.Description,
                        Component = appType.Component,
                        Icon = appType.Icon,
                        Color = appType.Color
                    }
                    : CreateFallbackAppType(component.Config?.Type),
                Configuration = JsonSerializer.Serialize(component.Config),
                SortOrder = component.Slot
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse GuestAppConfig for app lookup");
            return null;
        }
    }

    private static List<GuestAppComponent>? ParseGuestAppComponents(Dictionary<string, object> guestAppConfig)
    {
        var componentsJson = JsonSerializer.Serialize(guestAppConfig["components"]);
        return JsonSerializer.Deserialize<List<GuestAppComponent>>(componentsJson, JsonOptions);
    }

    private static EventAppDto MapToDto(EventAppDbModel app)
    {
        return new EventAppDto
        {
            Id = app.Id.ToString(),
            AppType = new AppTypeDto
            {
                Id = app.AppType!.Id,
                Name = app.AppType.Name,
                Description = app.AppType.Description,
                Component = app.AppType.Component,
                Icon = app.AppType.Icon,
                Color = app.AppType.Color
            },
            Configuration = app.Configuration,
            SortOrder = app.SortOrder
        };
    }

    private static string MapComponentTypeToAppTypeId(string? componentType)
    {
        return componentType switch
        {
            "remote" => "tv-remote",
            "guestbook" => "guestbook",
            "lists" => "lists",
            "gallery" => "photos",
            "schedule" => "schedule",
            "polls" => "polls",
            "custom" => "custom",
            _ => componentType ?? ""
        };
    }

    private static AppTypeDto CreateFallbackAppType(string? componentType)
    {
        return new AppTypeDto
        {
            Id = componentType ?? "unknown",
            Name = GetDefaultAppName(componentType),
            Description = null,
            Component = componentType ?? "unknown",
            Icon = GetDefaultAppIcon(componentType),
            Color = "#6366f1"
        };
    }

    private static string GetDefaultAppName(string? componentType)
    {
        return componentType switch
        {
            "remote" => "TV Remote",
            "guestbook" => "Guestbook",
            "lists" => "Wishlists",
            "gallery" => "Photo Gallery",
            "schedule" => "Event Schedule",
            "polls" => "Live Polls",
            "custom" => "Custom App",
            _ => "App"
        };
    }

    private static string GetDefaultAppIcon(string? componentType)
    {
        return componentType switch
        {
            "remote" => "tv",
            "guestbook" => "book-open",
            "lists" => "list",
            "gallery" => "image",
            "schedule" => "calendar",
            "polls" => "bar-chart",
            "custom" => "code",
            _ => "app-window"
        };
    }
}

// Internal models for GuestAppConfig parsing
internal class GuestAppComponent
{
    public string Id { get; set; } = string.Empty;
    public int Slot { get; set; }
    public GuestAppConfig? Config { get; set; }
}

internal class GuestAppConfig
{
    public string? Type { get; set; }
    public Dictionary<string, object>? Properties { get; set; }
}
