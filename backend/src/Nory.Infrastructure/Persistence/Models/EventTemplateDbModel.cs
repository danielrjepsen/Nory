namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;

public class EventTemplateDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid EventId { get; set; }

    [MaxLength(100)]
    public string? ThemeName { get; set; }

    public Guid? ThemeId { get; set; }

    [MaxLength(20)]
    public string? PrimaryColor { get; set; }

    [MaxLength(20)]
    public string? SecondaryColor { get; set; }

    [MaxLength(20)]
    public string? AccentColor { get; set; }

    [MaxLength(20)]
    public string? BackgroundColor1 { get; set; }

    [MaxLength(20)]
    public string? BackgroundColor2 { get; set; }

    [MaxLength(20)]
    public string? BackgroundColor3 { get; set; }

    [MaxLength(100)]
    public string? PrimaryFont { get; set; }

    [MaxLength(100)]
    public string? SecondaryFont { get; set; }

    public string? ThemeConfig { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual EventDbModel? Event { get; set; }
    public virtual ThemeDbModel? Theme { get; set; }
}
