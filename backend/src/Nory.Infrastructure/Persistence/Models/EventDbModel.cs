namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;
using Nory.Core.Domain.Enums;

public class EventDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(450)]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }

    public EventStatus Status { get; set; } = EventStatus.Draft;

    public bool IsPublic { get; set; } = true;

    public bool HasContent { get; set; } = false;

    [MaxLength(100)]
    public string? ThemeName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // nav properties
    public virtual ICollection<EventPhotoDbModel> Photos { get; set; } =
        new List<EventPhotoDbModel>();
    public virtual ICollection<EventAppDbModel> EventApps { get; set; } =
        new List<EventAppDbModel>();
    public virtual ICollection<EventCategoryDbModel> Categories { get; set; } =
        new List<EventCategoryDbModel>();
}
