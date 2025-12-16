using Nory.Application.DTOs.Events;
using Nory.Core.Domain.Entities;

namespace Nory.Application.Extensions;

public static class EventExtensions
{
    public static EventDto MapToDto(this Event eventEntity) =>
        new()
        {
            Id = eventEntity.Id,
            Name = eventEntity.Name,
            Description = eventEntity.Description,
            Location = eventEntity.Location,
            StartsAt = eventEntity.StartsAt,
            EndsAt = eventEntity.EndsAt,
            Status = eventEntity.Status.ToString().ToLowerInvariant(),
            IsPublic = eventEntity.IsPublic,
            HasContent = eventEntity.HasContent,
            PhotoCount = eventEntity.Photos.Count,
            ThemeName = eventEntity.ThemeName,
            CreatedAt = eventEntity.CreatedAt,
            UpdatedAt = eventEntity.UpdatedAt,
        };

    public static IReadOnlyList<EventDto> MapToDto(this IEnumerable<Event> events) =>
        events.Select(e => e.MapToDto()).ToList();
}
