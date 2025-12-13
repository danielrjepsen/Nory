using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class EventMappingExtensions
{
    public static Event MapToDomain(this EventDbModel dbModel)
    {
        return new Event(
            id: dbModel.Id,
            userId: dbModel.UserId,
            name: dbModel.Name,
            description: dbModel.Description,
            location: dbModel.Location,
            startsAt: dbModel.StartsAt,
            endsAt: dbModel.EndsAt,
            status: dbModel.Status,
            isPublic: dbModel.IsPublic,
            hasContent: dbModel.HasContent,
            guestAppConfig: dbModel.GuestAppConfig,
            themeName: dbModel.ThemeName,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt
        );
    }

    public static EventDbModel MapToDbModel(this Event domainEvent)
    {
        return new EventDbModel
        {
            Id = domainEvent.Id,
            UserId = domainEvent.UserId,
            Name = domainEvent.Name,
            Description = domainEvent.Description,
            Location = domainEvent.Location,
            StartsAt = domainEvent.StartsAt,
            EndsAt = domainEvent.EndsAt,
            Status = domainEvent.Status,
            IsPublic = domainEvent.IsPublic,
            HasContent = domainEvent.HasContent,
            GuestAppConfig = domainEvent.GuestAppConfig,
            ThemeName = domainEvent.ThemeName,
            CreatedAt = domainEvent.CreatedAt,
            UpdatedAt = domainEvent.UpdatedAt,
        };
    }

    public static void UpdateFrom(this EventDbModel dbModel, Event domainEvent)
    {
        dbModel.UserId = domainEvent.UserId;
        dbModel.Name = domainEvent.Name;
        dbModel.Description = domainEvent.Description;
        dbModel.Location = domainEvent.Location;
        dbModel.StartsAt = domainEvent.StartsAt;
        dbModel.EndsAt = domainEvent.EndsAt;
        dbModel.Status = domainEvent.Status;
        dbModel.IsPublic = domainEvent.IsPublic;
        dbModel.HasContent = domainEvent.HasContent;
        dbModel.GuestAppConfig = domainEvent.GuestAppConfig;
        dbModel.ThemeName = domainEvent.ThemeName;
        dbModel.UpdatedAt = domainEvent.UpdatedAt;
    }

    public static IReadOnlyList<Event> MapToDomain(this IEnumerable<EventDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }
}
