using System.ComponentModel.DataAnnotations;
using Nory.Core.Domain.Enums;

namespace Nory.Infrastructure.Persistence.Models;

public class EmailConfigurationDbModel
{
    [Key]
    public int Id { get; set; }

    public bool IsEnabled { get; set; }

    public EmailProvider Provider { get; set; }

    [Required]
    [MaxLength(255)]
    public string SmtpHost { get; set; } = null!;

    public int SmtpPort { get; set; }

    public bool UseSsl { get; set; }

    [Required]
    [MaxLength(255)]
    public string Username { get; set; } = null!;

    [Required]
    public string EncryptedPassword { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string FromEmail { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string FromName { get; set; } = null!;

    public DateTime? LastTestedAt { get; set; }

    public bool? LastTestSuccessful { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
