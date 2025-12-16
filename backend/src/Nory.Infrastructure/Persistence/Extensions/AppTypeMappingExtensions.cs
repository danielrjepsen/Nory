using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class AppTypeMappingExtensions
{
    public static AppType MapToDomain(this AppTypeDbModel dbModel)
    {
        return new AppType(
            id: dbModel.Id,
            name: dbModel.Name,
            description: dbModel.Description,
            component: dbModel.Component,
            icon: dbModel.Icon,
            color: dbModel.Color,
            isActive: dbModel.IsActive);
    }

    public static IReadOnlyList<AppType> MapToDomain(this IEnumerable<AppTypeDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }

    public static AppTypeDbModel MapToDbModel(this AppType appType)
    {
        return new AppTypeDbModel
        {
            Id = appType.Id,
            Name = appType.Name,
            Description = appType.Description,
            Component = appType.Component,
            Icon = appType.Icon,
            Color = appType.Color,
            IsActive = appType.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
