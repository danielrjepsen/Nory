namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;

public class AttendeeDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid EventId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Email { get; set; }

    public bool HasPhotoRevealConsent { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Soft delete timestamp for GDPR compliance.
    /// When set, personal data has been anonymized.
    /// </summary>
    public DateTime? DeletedAt { get; set; }

    // Navigation property
    public virtual EventDbModel? Event { get; set; }
}
