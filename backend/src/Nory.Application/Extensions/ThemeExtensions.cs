using Nory.Application.DTOs.Themes;
using Nory.Core.Domain.Entities;

namespace Nory.Application.Extensions;

public static class ThemeExtensions
{
    public static ThemeDto MapToDto(this Theme theme) =>
        new(
            theme.Id,
            theme.Name,
            theme.DisplayName,
            theme.Description,
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
            theme.ThemeConfig,
            theme.DarkBackgroundGradient,
            theme.DarkParticleColors,
            theme.IsSystemTheme,
            theme.SortOrder,
            theme.CreatedAt,
            theme.UpdatedAt
        );

    public static ThemePresetDto MapToPresetDto(this Theme theme) =>
        new(
            theme.Id,
            theme.Name,
            theme.DisplayName,
            theme.Description,
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
            theme.ThemeConfig,
            theme.IsSystemTheme,
            theme.SortOrder,
            theme.DarkBackgroundGradient,
            theme.DarkParticleColors
        );

    public static IReadOnlyList<ThemeDto> MapToDto(this IEnumerable<Theme> themes) =>
        themes.Select(t => t.MapToDto()).ToList();

    public static IReadOnlyList<ThemePresetDto> MapToPresetDto(this IEnumerable<Theme> themes) =>
        themes.Select(t => t.MapToPresetDto()).ToList();
}
