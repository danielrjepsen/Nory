namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;
using Nory.Core.Domain.Enums;

public class EventDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
    
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }

    public EventStatus Status { get; set; } = EventStatus.Draft;

    // Track if event has ever had content (photos / videos uploaded)
    public bool HasContent { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<EventPhotoDbModel> Photos { get; set; } = new List<EventPhotoDbModel>();
    public virtual ICollection<EventAppDbModel> EventApps { get; set; } = new List<EventAppDbModel>();
    public virtual ICollection<EventCategoryDbModel> Categories { get; set; } = new List<EventCategoryDbModel>();
}