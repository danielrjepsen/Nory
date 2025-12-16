using Nory.Application.DTOs.EventApps;
using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class EventAppMappingExtensions
{
    public static EventApp MapToDomain(this EventAppDbModel dbModel)
    {
        return new EventApp(
            id: dbModel.Id,
            eventId: dbModel.EventId,
            appTypeId: dbModel.AppTypeId,
            configuration: dbModel.Configuration,
            isEnabled: dbModel.IsEnabled,
            sortOrder: dbModel.SortOrder,
            appType: dbModel.AppType?.MapToDomain());
    }

    public static IReadOnlyList<EventApp> MapToDomain(this IEnumerable<EventAppDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }

    public static EventAppDto MapToDto(this EventApp app)
    {
        return new EventAppDto
        {
            Id = app.Id.ToString(),
            AppType = app.AppType != null
                ? new AppTypeDto
                {
                    Id = app.AppType.Id,
                    Name = app.AppType.Name,
                    Description = app.AppType.Description,
                    Component = app.AppType.Component,
                    Icon = app.AppType.Icon,
                    Color = app.AppType.Color
                }
                : null,
            Configuration = app.Configuration,
            SortOrder = app.SortOrder
        };
    }

    public static AppTypeDto MapToDto(this AppType appType)
    {
        return new AppTypeDto
        {
            Id = appType.Id,
            Name = appType.Name,
            Description = appType.Description,
            Component = appType.Component,
            Icon = appType.Icon,
            Color = appType.Color
        };
    }

    public static EventAppDbModel MapToDbModel(this EventApp eventApp)
    {
        return new EventAppDbModel
        {
            Id = eventApp.Id,
            EventId = eventApp.EventId,
            AppTypeId = eventApp.AppTypeId,
            Configuration = eventApp.Configuration,
            IsEnabled = eventApp.IsEnabled,
            SortOrder = eventApp.SortOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
