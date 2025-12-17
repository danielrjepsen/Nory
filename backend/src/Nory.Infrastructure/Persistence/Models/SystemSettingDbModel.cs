using System.ComponentModel.DataAnnotations;

namespace Nory.Infrastructure.Persistence.Models;

public class SystemSettingDbModel
{
    [Key]
    [MaxLength(100)]
    public string Key { get; set; } = null!;

    [Required]
    public string Value { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
