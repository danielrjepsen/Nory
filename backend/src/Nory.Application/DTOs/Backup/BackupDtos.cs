using Nory.Core.Domain.Enums;

namespace Nory.Application.DTOs.Backup;

public record ConfigureBackupCommand(
    BackupProvider Provider,
    BackupSchedule Schedule,
    string FolderName,
    string ServiceAccountJson
);

public record UpdateBackupCommand(
    BackupSchedule? Schedule,
    string? FolderName
);

public record BackupConfigurationDto(
    Guid Id,
    bool IsEnabled,
    BackupProvider Provider,
    BackupSchedule Schedule,
    string? FolderName,
    string? FolderId,
    string? ServiceAccountEmail,
    DateTime? LastBackupAt,
    BackupStatus LastBackupStatus,
    string? LastBackupError,
    int TotalFilesBackedUp,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record BackupHistoryDto(
    Guid Id,
    DateTime StartedAt,
    DateTime? CompletedAt,
    BackupStatus Status,
    int FilesProcessed,
    int FilesUploaded,
    int FilesSkipped,
    int FilesFailed,
    long TotalBytesUploaded,
    string? ErrorMessage
);

public record BackupRunResult(
    bool Success,
    int FilesUploaded,
    int FilesSkipped,
    int FilesFailed,
    long TotalBytesUploaded,
    string? ErrorMessage
);

public record TestConnectionResult(
    bool Success,
    string? FolderId,
    string? ErrorMessage
);
