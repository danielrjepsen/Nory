namespace Nory.Infrastructure.Persistence.Models;

using System.ComponentModel.DataAnnotations;
using Nory.Core.Domain.Enums;

public class BackupHistoryDbModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BackupConfigurationId { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    public BackupStatus Status { get; set; } = BackupStatus.InProgress;

    public int FilesProcessed { get; set; }

    public int FilesUploaded { get; set; }

    public int FilesSkipped { get; set; }

    public int FilesFailed { get; set; }

    public long TotalBytesUploaded { get; set; }

    [MaxLength(500)]
    public string? ErrorMessage { get; set; }

    [MaxLength(4000)]
    public string? ErrorDetails { get; set; }

    public virtual BackupConfigurationDbModel? BackupConfiguration { get; set; }
}
