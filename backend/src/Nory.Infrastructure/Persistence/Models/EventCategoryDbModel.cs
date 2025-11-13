using System.ComponentModel.DataAnnotations;

namespace Nory.Infrastructure.Persistence.Models;

public class EventCategoryDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid EventId { get; set; }
    public EventDbModel? Event { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public int SortOrder { get; set; } = 0;

    public bool IsDefault { get; set; } = false; // True for auto created "Uncategorized"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<EventPhotoDbModel> Photos { get; set; } = new List<EventPhotoDbModel>();
}
