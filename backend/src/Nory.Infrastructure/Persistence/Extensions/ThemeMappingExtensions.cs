using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class ThemeMappingExtensions
{
    public static Theme MapToDomain(this ThemeDbModel dbModel)
    {
        return new Theme(
            id: dbModel.Id,
            name: dbModel.Name,
            displayName: dbModel.DisplayName,
            description: dbModel.Description,
            primaryColor: dbModel.PrimaryColor,
            secondaryColor: dbModel.SecondaryColor,
            accentColor: dbModel.AccentColor,
            backgroundColor1: dbModel.BackgroundColor1,
            backgroundColor2: dbModel.BackgroundColor2,
            backgroundColor3: dbModel.BackgroundColor3,
            textPrimary: dbModel.TextPrimary,
            textSecondary: dbModel.TextSecondary,
            textAccent: dbModel.TextAccent,
            primaryFont: dbModel.PrimaryFont,
            secondaryFont: dbModel.SecondaryFont,
            themeConfig: dbModel.ThemeConfig,
            darkBackgroundGradient: dbModel.DarkBackgroundGradient,
            darkParticleColors: dbModel.DarkParticleColors,
            isSystemTheme: dbModel.IsSystemTheme,
            isActive: dbModel.IsActive,
            sortOrder: dbModel.SortOrder,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt
        );
    }

    public static ThemeDbModel MapToDbModel(this Theme theme)
    {
        return new ThemeDbModel
        {
            Id = theme.Id,
            Name = theme.Name,
            DisplayName = theme.DisplayName,
            Description = theme.Description,
            PrimaryColor = theme.PrimaryColor,
            SecondaryColor = theme.SecondaryColor,
            AccentColor = theme.AccentColor,
            BackgroundColor1 = theme.BackgroundColor1,
            BackgroundColor2 = theme.BackgroundColor2,
            BackgroundColor3 = theme.BackgroundColor3,
            TextPrimary = theme.TextPrimary,
            TextSecondary = theme.TextSecondary,
            TextAccent = theme.TextAccent,
            PrimaryFont = theme.PrimaryFont,
            SecondaryFont = theme.SecondaryFont,
            ThemeConfig = theme.ThemeConfig,
            DarkBackgroundGradient = theme.DarkBackgroundGradient,
            DarkParticleColors = theme.DarkParticleColors,
            IsSystemTheme = theme.IsSystemTheme,
            IsActive = theme.IsActive,
            SortOrder = theme.SortOrder,
            CreatedAt = theme.CreatedAt,
            UpdatedAt = theme.UpdatedAt
        };
    }

    public static void UpdateFrom(this ThemeDbModel dbModel, Theme theme)
    {
        dbModel.DisplayName = theme.DisplayName;
        dbModel.Description = theme.Description;
        dbModel.PrimaryColor = theme.PrimaryColor;
        dbModel.SecondaryColor = theme.SecondaryColor;
        dbModel.AccentColor = theme.AccentColor;
        dbModel.BackgroundColor1 = theme.BackgroundColor1;
        dbModel.BackgroundColor2 = theme.BackgroundColor2;
        dbModel.BackgroundColor3 = theme.BackgroundColor3;
        dbModel.TextPrimary = theme.TextPrimary;
        dbModel.TextSecondary = theme.TextSecondary;
        dbModel.TextAccent = theme.TextAccent;
        dbModel.PrimaryFont = theme.PrimaryFont;
        dbModel.SecondaryFont = theme.SecondaryFont;
        dbModel.ThemeConfig = theme.ThemeConfig;
        dbModel.DarkBackgroundGradient = theme.DarkBackgroundGradient;
        dbModel.DarkParticleColors = theme.DarkParticleColors;
        dbModel.IsActive = theme.IsActive;
        dbModel.SortOrder = theme.SortOrder;
        dbModel.UpdatedAt = theme.UpdatedAt;
    }

    public static IReadOnlyList<Theme> MapToDomain(this IEnumerable<ThemeDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }
}
