using System.ComponentModel.DataAnnotations;
using Nory.Infrastructure.Persistence.Models;

public class EventPhotoDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid EventId { get; set; }

    public EventDbModel? Event { get; set; }

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string OriginalFileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;

    public long FileSizeBytes { get; set; }

    [Required]
    public string StoragePath { get; set; } = string.Empty;

    [Required]
    public string CdnUrl { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? UploadedBy { get; set; } // Guest name who uploaded

    public int? Year { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Metadata
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string? ExifData { get; set; }
}
