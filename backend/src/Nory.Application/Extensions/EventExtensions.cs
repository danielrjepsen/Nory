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
            StartsAt = eventEntity.StartsAt,
            EndsAt = eventEntity.EndsAt,
            Status = eventEntity.Status.ToString(),
            HasContent = eventEntity.HasContent,
            PhotoCount = eventEntity.Photos.Count,
            CreatedAt = eventEntity.CreatedAt,
            UpdatedAt = eventEntity.UpdatedAt,
        };
}
