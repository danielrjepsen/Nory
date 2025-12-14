namespace Nory.Core.Domain.Entities;

public class Theme
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string DisplayName { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string PrimaryColor { get; private set; } = string.Empty;
    public string SecondaryColor { get; private set; } = string.Empty;
    public string AccentColor { get; private set; } = string.Empty;
    public string? BackgroundColor1 { get; private set; }
    public string? BackgroundColor2 { get; private set; }
    public string? BackgroundColor3 { get; private set; }
    public string? TextPrimary { get; private set; }
    public string? TextSecondary { get; private set; }
    public string? TextAccent { get; private set; }
    public string PrimaryFont { get; private set; } = "Inter";
    public string SecondaryFont { get; private set; } = "Inter";
    public string? ThemeConfig { get; private set; }
    public string? DarkBackgroundGradient { get; private set; }
    public string? DarkParticleColors { get; private set; }
    public bool IsSystemTheme { get; private set; }
    public bool IsActive { get; private set; }
    public int SortOrder { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Theme() { }

    public Theme(
        Guid id,
        string name,
        string displayName,
        string? description,
        string primaryColor,
        string secondaryColor,
        string accentColor,
        string? backgroundColor1,
        string? backgroundColor2,
        string? backgroundColor3,
        string? textPrimary,
        string? textSecondary,
        string? textAccent,
        string primaryFont,
        string secondaryFont,
        string? themeConfig,
        string? darkBackgroundGradient,
        string? darkParticleColors,
        bool isSystemTheme,
        bool isActive,
        int sortOrder,
        DateTime createdAt,
        DateTime updatedAt)
    {
        Id = id;
        Name = name;
        DisplayName = displayName;
        Description = description;
        PrimaryColor = primaryColor;
        SecondaryColor = secondaryColor;
        AccentColor = accentColor;
        BackgroundColor1 = backgroundColor1;
        BackgroundColor2 = backgroundColor2;
        BackgroundColor3 = backgroundColor3;
        TextPrimary = textPrimary;
        TextSecondary = textSecondary;
        TextAccent = textAccent;
        PrimaryFont = primaryFont;
        SecondaryFont = secondaryFont;
        ThemeConfig = themeConfig;
        DarkBackgroundGradient = darkBackgroundGradient;
        DarkParticleColors = darkParticleColors;
        IsSystemTheme = isSystemTheme;
        IsActive = isActive;
        SortOrder = sortOrder;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static Theme Create(
        string name,
        string displayName,
        string primaryColor,
        string secondaryColor,
        string accentColor,
        string? description = null,
        string? backgroundColor1 = null,
        string? backgroundColor2 = null,
        string? backgroundColor3 = null,
        string? textPrimary = null,
        string? textSecondary = null,
        string? textAccent = null,
        string? primaryFont = null,
        string? secondaryFont = null,
        string? themeConfig = null,
        string? darkBackgroundGradient = null,
        string? darkParticleColors = null,
        bool isSystemTheme = false,
        int sortOrder = 999)
    {
        ValidateName(name);
        ValidateDisplayName(displayName);
        ValidateColor(primaryColor, nameof(primaryColor));
        ValidateColor(secondaryColor, nameof(secondaryColor));
        ValidateColor(accentColor, nameof(accentColor));

        return new Theme(
            id: Guid.NewGuid(),
            name: name.ToLower().Replace(" ", "-"),
            displayName: displayName.Trim(),
            description: description?.Trim(),
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            accentColor: accentColor,
            backgroundColor1: backgroundColor1,
            backgroundColor2: backgroundColor2,
            backgroundColor3: backgroundColor3,
            textPrimary: textPrimary,
            textSecondary: textSecondary,
            textAccent: textAccent,
            primaryFont: primaryFont ?? "Inter",
            secondaryFont: secondaryFont ?? "Inter",
            themeConfig: themeConfig,
            darkBackgroundGradient: darkBackgroundGradient,
            darkParticleColors: darkParticleColors,
            isSystemTheme: isSystemTheme,
            isActive: true,
            sortOrder: sortOrder,
            createdAt: DateTime.UtcNow,
            updatedAt: DateTime.UtcNow
        );
    }

    public static Theme CreateSystemTheme(
        string name,
        string displayName,
        string primaryColor,
        string secondaryColor,
        string accentColor,
        string? description = null,
        string? backgroundColor1 = null,
        string? backgroundColor2 = null,
        string? backgroundColor3 = null,
        string? textPrimary = null,
        string? textSecondary = null,
        string? textAccent = null,
        string? primaryFont = null,
        string? secondaryFont = null,
        string? themeConfig = null,
        string? darkBackgroundGradient = null,
        string? darkParticleColors = null,
        int sortOrder = 999)
    {
        return Create(
            name, displayName, primaryColor, secondaryColor, accentColor,
            description, backgroundColor1, backgroundColor2, backgroundColor3,
            textPrimary, textSecondary, textAccent, primaryFont, secondaryFont,
            themeConfig, darkBackgroundGradient, darkParticleColors,
            isSystemTheme: true, sortOrder: sortOrder
        );
    }

    public void Update(
        string displayName,
        string primaryColor,
        string secondaryColor,
        string accentColor,
        string? description = null,
        string? backgroundColor1 = null,
        string? backgroundColor2 = null,
        string? backgroundColor3 = null,
        string? textPrimary = null,
        string? textSecondary = null,
        string? textAccent = null,
        string? primaryFont = null,
        string? secondaryFont = null,
        string? themeConfig = null,
        string? darkBackgroundGradient = null,
        string? darkParticleColors = null,
        bool? isActive = null,
        int? sortOrder = null)
    {
        ValidateDisplayName(displayName);
        ValidateColor(primaryColor, nameof(primaryColor));
        ValidateColor(secondaryColor, nameof(secondaryColor));
        ValidateColor(accentColor, nameof(accentColor));

        DisplayName = displayName.Trim();
        Description = description?.Trim();
        PrimaryColor = primaryColor;
        SecondaryColor = secondaryColor;
        AccentColor = accentColor;
        BackgroundColor1 = backgroundColor1;
        BackgroundColor2 = backgroundColor2;
        BackgroundColor3 = backgroundColor3;
        TextPrimary = textPrimary;
        TextSecondary = textSecondary;
        TextAccent = textAccent;
        PrimaryFont = primaryFont ?? PrimaryFont;
        SecondaryFont = secondaryFont ?? SecondaryFont;
        ThemeConfig = themeConfig;
        DarkBackgroundGradient = darkBackgroundGradient;
        DarkParticleColors = darkParticleColors;

        if (isActive.HasValue)
            IsActive = isActive.Value;

        if (sortOrder.HasValue)
            SortOrder = sortOrder.Value;

        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Theme name is required", nameof(name));

        if (name.Length > 100)
            throw new ArgumentException("Theme name cannot exceed 100 characters", nameof(name));
    }

    private static void ValidateDisplayName(string displayName)
    {
        if (string.IsNullOrWhiteSpace(displayName))
            throw new ArgumentException("Theme display name is required", nameof(displayName));

        if (displayName.Length > 200)
            throw new ArgumentException("Theme display name cannot exceed 200 characters", nameof(displayName));
    }

    private static void ValidateColor(string color, string paramName)
    {
        if (string.IsNullOrWhiteSpace(color))
            throw new ArgumentException($"{paramName} is required", paramName);

        if (color.Length > 20)
            throw new ArgumentException($"{paramName} cannot exceed 20 characters", paramName);
    }
}
