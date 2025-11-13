using System.ComponentModel.DataAnnotations;

namespace Nory.Infrastructure.Persistence.Models;

public class EventAppDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid EventId { get; set; }

    [Required, MaxLength(100)]
    public string AppTypeId { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Configuration { get; set; } // JSON configuration specific to this app instance

    public bool IsEnabled { get; set; } = true;

    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public EventDbModel? Event { get; set; }
    public AppTypeDbModel? AppType { get; set; }
}
