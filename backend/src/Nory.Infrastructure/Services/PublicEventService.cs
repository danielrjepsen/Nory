using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;
using Nory.Infrastructure.Persistence;

namespace Nory.Infrastructure.Services;

public class PublicEventService : IPublicEventService
{
    private readonly ApplicationDbContext _context;
    private readonly IThemeService _themeService;
    private readonly IFileStorageService _fileStorage;
    private readonly ILogger<PublicEventService> _logger;

    public PublicEventService(
        ApplicationDbContext context,
        IThemeService themeService,
        IFileStorageService fileStorage,
        ILogger<PublicEventService> logger)
    {
        _context = context;
        _themeService = themeService;
        _fileStorage = fileStorage;
        _logger = logger;
    }

    public async Task<Result<PublicPhotosResponse>> GetPhotosAsync(
        Guid eventId,
        GetPhotosQuery query,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Fetching photos for event {EventId}, limit: {Limit}, offset: {Offset}, preview: {Preview}",
            eventId, query.Limit, query.Offset, query.Preview);

        var eventEntity = await _context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity is null)
        {
            _logger.LogWarning("Event {EventId} not found", eventId);
            return Result<PublicPhotosResponse>.NotFound("Event not found");
        }

        var statusCheck = CheckEventStatus(eventEntity.Status, eventEntity.EndsAt, query.Preview);
        if (!statusCheck.IsSuccess)
        {
            return Result<PublicPhotosResponse>.BadRequest(statusCheck.Error!);
        }

        var photosQuery = _context.EventPhotos
            .AsNoTracking()
            .Where(p => p.EventId == eventId);

        if (query.CategoryId.HasValue)
        {
            photosQuery = photosQuery.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        var photos = await photosQuery
            .OrderByDescending(p => p.CreatedAt)
            .Skip(query.Offset)
            .Take(Math.Min(query.Limit, 100))
            .Select(p => new PublicPhotoDto(
                p.Id,
                $"/api/v1/events/{eventId}/photos/{p.Id}/image",
                p.OriginalFileName,
                p.UploadedBy ?? "Anonymous",
                p.CategoryId,
                p.Width,
                p.Height,
                p.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {Count} photos for event {EventId}", photos.Count, eventId);

        return Result<PublicPhotosResponse>.Success(
            new PublicPhotosResponse(true, photos, photos.Count));
    }

    public async Task<Result<FileResult>> GetPhotoImageAsync(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken = default)
    {
        var photo = await _context.EventPhotos
            .AsNoTracking()
            .Include(p => p.Event)
            .FirstOrDefaultAsync(p => p.Id == photoId && p.EventId == eventId, cancellationToken);

        if (photo?.Event is null)
        {
            return Result<FileResult>.NotFound("Photo not found");
        }

        if (!IsEventViewable(photo.Event.Status, photo.Event.EndsAt))
        {
            return Result<FileResult>.NotFound("Photo not found");
        }

        if (string.IsNullOrEmpty(photo.StoragePath))
        {
            _logger.LogWarning("Photo {PhotoId} has no storage path", photoId);
            return Result<FileResult>.NotFound("Photo not found");
        }

        var fileResult = await _fileStorage.GetFileAsync(photo.StoragePath, cancellationToken);
        if (fileResult is null)
        {
            _logger.LogWarning("File not found for photo {PhotoId}: {Path}", photoId, photo.StoragePath);
            return Result<FileResult>.NotFound("Photo not found");
        }

        return Result<FileResult>.Success(new FileResult(fileResult.FileStream, fileResult.ContentType));
    }

    public async Task<Result<PublicCategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching categories for event {EventId}", eventId);

        var categories = await _context.EventCategories
            .AsNoTracking()
            .Where(c => c.EventId == eventId)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .Select(c => new PublicCategoryDto(
                c.Id.ToString(),
                c.Name,
                c.Description,
                c.SortOrder,
                c.IsDefault,
                c.Photos.Count,
                c.CreatedAt,
                c.UpdatedAt
            ))
            .ToListAsync(cancellationToken);

        return Result<PublicCategoriesResponse>.Success(
            new PublicCategoriesResponse(true, categories));
    }

    public async Task<Result<TemplateResponse>> GetTemplateAsync(
        Guid eventId,
        CancellationToken cancellationToken = default)
    {
        var eventEntity = await _context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity is null)
        {
            return Result<TemplateResponse>.NotFound("Event not found");
        }

        if (!string.IsNullOrEmpty(eventEntity.ThemeName))
        {
            var themeResult = await _themeService.GetThemeByNameAsync(eventEntity.ThemeName, cancellationToken);
            if (themeResult.IsSuccess)
            {
                var theme = themeResult.Data!;
                return Result<TemplateResponse>.Success(new TemplateResponse(new EventTemplateDto(
                    theme.Name,
                    theme.DisplayName,
                    theme.PrimaryColor,
                    theme.SecondaryColor,
                    theme.AccentColor,
                    theme.BackgroundColor1,
                    theme.BackgroundColor2,
                    theme.BackgroundColor3,
                    theme.TextPrimary,
                    theme.TextSecondary,
                    theme.TextAccent,
                    theme.PrimaryFont,
                    theme.SecondaryFont,
                    theme.DarkBackgroundGradient,
                    theme.DarkParticleColors
                )));
            }
        }

        return Result<TemplateResponse>.Success(new TemplateResponse(null));
    }

    private static Result CheckEventStatus(EventStatus status, DateTime? endsAt, bool preview)
    {
        if (status == EventStatus.Archived)
        {
            return Result.NotFound("Event not found");
        }

        if (status == EventStatus.Ended)
        {
            return Result.BadRequest($"This event has ended|status=ended|endsAt={endsAt}");
        }

        if (status == EventStatus.Draft && !preview)
        {
            return Result.BadRequest("This event is not yet live|status=draft");
        }

        return Result.Success();
    }

    private static bool IsEventViewable(EventStatus status, DateTime? endsAt)
    {
        if (status == EventStatus.Live)
            return true;

        if (status == EventStatus.Ended && endsAt.HasValue)
        {
            var daysSinceEnd = (DateTime.UtcNow - endsAt.Value).TotalDays;
            return daysSinceEnd <= 30;
        }

        return false;
    }
}
