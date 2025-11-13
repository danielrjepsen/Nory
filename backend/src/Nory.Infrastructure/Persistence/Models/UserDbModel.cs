using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Nory.Infrastructure.Persistence.Models;

public class UserDbModel : IdentityUser<Guid>
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Locale { get; set; } = "en";

    [MaxLength(500)]
    public string? ProfilePictureUrl { get; set; }

    public DateTime? EmailVerifiedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
