namespace Nory.Core.Domain.Entities;

using Nory.Core.Domain.Enums;

public class BackupHistory
{
    public Guid Id { get; private set; }
    public Guid BackupConfigurationId { get; private set; }
    public DateTime StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public BackupStatus Status { get; private set; }
    public int FilesProcessed { get; private set; }
    public int FilesUploaded { get; private set; }
    public int FilesSkipped { get; private set; }
    public int FilesFailed { get; private set; }
    public long TotalBytesUploaded { get; private set; }
    public string? ErrorMessage { get; private set; }
    public string? ErrorDetails { get; private set; }

    private BackupHistory() { }

    public BackupHistory(
        Guid id,
        Guid backupConfigurationId,
        DateTime startedAt,
        DateTime? completedAt,
        BackupStatus status,
        int filesProcessed,
        int filesUploaded,
        int filesSkipped,
        int filesFailed,
        long totalBytesUploaded,
        string? errorMessage,
        string? errorDetails)
    {
        Id = id;
        BackupConfigurationId = backupConfigurationId;
        StartedAt = startedAt;
        CompletedAt = completedAt;
        Status = status;
        FilesProcessed = filesProcessed;
        FilesUploaded = filesUploaded;
        FilesSkipped = filesSkipped;
        FilesFailed = filesFailed;
        TotalBytesUploaded = totalBytesUploaded;
        ErrorMessage = errorMessage;
        ErrorDetails = errorDetails;
    }

    public static BackupHistory Start(Guid backupConfigurationId)
    {
        return new BackupHistory(
            id: Guid.NewGuid(),
            backupConfigurationId: backupConfigurationId,
            startedAt: DateTime.UtcNow,
            completedAt: null,
            status: BackupStatus.InProgress,
            filesProcessed: 0,
            filesUploaded: 0,
            filesSkipped: 0,
            filesFailed: 0,
            totalBytesUploaded: 0,
            errorMessage: null,
            errorDetails: null
        );
    }

    public void RecordFileUploaded(long bytesUploaded)
    {
        FilesProcessed++;
        FilesUploaded++;
        TotalBytesUploaded += bytesUploaded;
    }

    public void RecordFileSkipped()
    {
        FilesProcessed++;
        FilesSkipped++;
    }

    public void RecordFileFailed()
    {
        FilesProcessed++;
        FilesFailed++;
    }

    public void Complete()
    {
        CompletedAt = DateTime.UtcNow;
        Status = FilesFailed > 0 && FilesUploaded == 0
            ? BackupStatus.Failed
            : BackupStatus.Success;
    }

    public void Fail(string errorMessage, string? errorDetails = null)
    {
        CompletedAt = DateTime.UtcNow;
        Status = BackupStatus.Failed;
        ErrorMessage = errorMessage;
        ErrorDetails = errorDetails;
    }
}
