namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;
using Nory.Core.Domain.Enums;

public class BackupConfigurationDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public bool IsEnabled { get; set; }

    public BackupProvider Provider { get; set; } = BackupProvider.None;

    public BackupSchedule Schedule { get; set; } = BackupSchedule.Daily;

    [MaxLength(200)]
    public string? FolderName { get; set; }

    [MaxLength(100)]
    public string? FolderId { get; set; }

    [MaxLength(500)]
    public string? ServiceAccountEmail { get; set; }

    public string? EncryptedCredentials { get; set; }

    public DateTime? LastBackupAt { get; set; }

    public BackupStatus LastBackupStatus { get; set; } = BackupStatus.None;

    [MaxLength(2000)]
    public string? LastBackupError { get; set; }

    public int TotalFilesBackedUp { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<BackupHistoryDbModel> BackupHistory { get; set; } = new List<BackupHistoryDbModel>();
}
