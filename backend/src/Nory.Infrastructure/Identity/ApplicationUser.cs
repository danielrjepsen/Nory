using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Nory.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Locale { get; set; } = "en";

    [MaxLength(500)]
    public string? ProfilePicture { get; set; }

    public DateTime? EmailVerifiedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
