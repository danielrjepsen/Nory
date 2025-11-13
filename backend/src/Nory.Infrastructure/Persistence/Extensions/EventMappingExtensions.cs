// Infrastructure/Persistence/Extensions/EventMappingExtensions.cs (NEW FILE)
using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class EventMappingExtensions
{
    // DbModel -> Domain
    public static Event MapToDomain(this EventDbModel dbModel)
    {
        return Event.FromPersistence(
            dbModel.Id,
            dbModel.Name,
            dbModel.Description,
            dbModel.StartsAt,
            dbModel.EndsAt,
            dbModel.Status,
            dbModel.HasContent,
            dbModel.CreatedAt,
            dbModel.UpdatedAt
        );
    }

    // Domain -> DbModel
    public static EventDbModel MapToDbModel(this Event domainEvent)
    {
        return new EventDbModel
        {
            Id = domainEvent.Id,
            Name = domainEvent.Name,
            Description = domainEvent.Description,
            StartsAt = domainEvent.StartsAt,
            EndsAt = domainEvent.EndsAt,
            Status = domainEvent.Status,
            HasContent = domainEvent.HasContent,
            CreatedAt = domainEvent.CreatedAt,
            UpdatedAt = domainEvent.UpdatedAt,
        };
    }

    // Batch
    public static List<Event> MapToDomain(this IEnumerable<EventDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }
}
