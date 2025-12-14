namespace Nory.Application.DTOs.Themes;

public record ThemeDto(
    Guid Id,
    string Name,
    string DisplayName,
    string? Description,
    string PrimaryColor,
    string SecondaryColor,
    string AccentColor,
    string? BackgroundColor1,
    string? BackgroundColor2,
    string? BackgroundColor3,
    string? TextPrimary,
    string? TextSecondary,
    string? TextAccent,
    string PrimaryFont,
    string SecondaryFont,
    string? ThemeConfig,
    string? DarkBackgroundGradient,
    string? DarkParticleColors,
    bool IsSystemTheme,
    int SortOrder,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record ThemePresetDto(
    Guid Id,
    string Name,
    string DisplayName,
    string? Description,
    string PrimaryColor,
    string SecondaryColor,
    string AccentColor,
    string? BackgroundColor1,
    string? BackgroundColor2,
    string? BackgroundColor3,
    string? TextPrimary,
    string? TextSecondary,
    string? TextAccent,
    string PrimaryFont,
    string SecondaryFont,
    string? ThemeConfig,
    bool IsSystemTheme,
    int SortOrder,
    string? DarkBackgroundGradient,
    string? DarkParticleColors
);

public record CreateThemeDto(
    string Name,
    string DisplayName,
    string? Description,
    string PrimaryColor,
    string SecondaryColor,
    string AccentColor,
    string? BackgroundColor1,
    string? BackgroundColor2,
    string? BackgroundColor3,
    string? TextPrimary,
    string? TextSecondary,
    string? TextAccent,
    string? PrimaryFont,
    string? SecondaryFont,
    string? ThemeConfig,
    string? DarkBackgroundGradient,
    string? DarkParticleColors,
    int? SortOrder
);

public record UpdateThemeDto(
    string DisplayName,
    string? Description,
    string PrimaryColor,
    string SecondaryColor,
    string AccentColor,
    string? BackgroundColor1,
    string? BackgroundColor2,
    string? BackgroundColor3,
    string? TextPrimary,
    string? TextSecondary,
    string? TextAccent,
    string? PrimaryFont,
    string? SecondaryFont,
    string? ThemeConfig,
    string? DarkBackgroundGradient,
    string? DarkParticleColors,
    bool? IsActive,
    int? SortOrder,
    bool AllowSystemThemeModification = false
);

// Response DTOs
public record ThemePresetsResponse(bool Success, IReadOnlyList<ThemePresetDto> Presets);
public record ThemeResponse(bool Success, ThemeDto Theme, string? Message = null);
