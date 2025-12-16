using Nory.Application.DTOs;
using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class CategoryMappingExtensions
{
    public static EventCategory MapToDomain(this EventCategoryDbModel dbModel)
    {
        return new EventCategory(
            id: dbModel.Id,
            eventId: dbModel.EventId,
            name: dbModel.Name,
            description: dbModel.Description,
            sortOrder: dbModel.SortOrder,
            isDefault: dbModel.IsDefault,
            photoCount: dbModel.Photos?.Count ?? 0,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt);
    }

    public static EventCategoryDbModel MapToDbModel(this EventCategory category)
    {
        return new EventCategoryDbModel
        {
            Id = category.Id,
            EventId = category.EventId,
            Name = category.Name,
            Description = category.Description,
            SortOrder = category.SortOrder,
            IsDefault = category.IsDefault,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public static void UpdateFrom(this EventCategoryDbModel dbModel, EventCategory category)
    {
        dbModel.Name = category.Name;
        dbModel.Description = category.Description;
        dbModel.SortOrder = category.SortOrder;
        dbModel.UpdatedAt = category.UpdatedAt;
    }

    public static IReadOnlyList<EventCategory> MapToDomain(this IEnumerable<EventCategoryDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }

    public static CategoryDto MapToDto(this EventCategory category)
    {
        return new CategoryDto(
            category.Id,
            category.Name,
            category.Description,
            category.SortOrder,
            category.IsDefault,
            category.PhotoCount,
            category.CreatedAt,
            category.UpdatedAt);
    }
}
