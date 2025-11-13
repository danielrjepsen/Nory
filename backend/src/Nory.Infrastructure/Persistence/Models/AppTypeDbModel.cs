using System.ComponentModel.DataAnnotations;

namespace Nory.Infrastructure.Persistence.Models;

public class AppTypeDbModel
{
    [Required, MaxLength(100)]
    public string Id { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required, MaxLength(100)]
    public string Component { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Icon { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Color { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<EventAppDbModel> EventApps { get; set; } = new List<EventAppDbModel>();
}
