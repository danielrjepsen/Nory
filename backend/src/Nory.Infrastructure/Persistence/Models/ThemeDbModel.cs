namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;

public class ThemeDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(20)]
    public string PrimaryColor { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string SecondaryColor { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string AccentColor { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? BackgroundColor1 { get; set; }

    [MaxLength(20)]
    public string? BackgroundColor2 { get; set; }

    [MaxLength(20)]
    public string? BackgroundColor3 { get; set; }

    [MaxLength(20)]
    public string? TextPrimary { get; set; }

    [MaxLength(20)]
    public string? TextSecondary { get; set; }

    [MaxLength(20)]
    public string? TextAccent { get; set; }

    [MaxLength(100)]
    public string PrimaryFont { get; set; } = "Inter";

    [MaxLength(100)]
    public string SecondaryFont { get; set; } = "Inter";

    public string? ThemeConfig { get; set; }

    public string? DarkBackgroundGradient { get; set; }

    public string? DarkParticleColors { get; set; }

    public bool IsSystemTheme { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; } = 999;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
