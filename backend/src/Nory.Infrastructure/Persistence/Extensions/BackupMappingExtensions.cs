using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class BackupMappingExtensions
{
    public static BackupConfiguration MapToDomain(this BackupConfigurationDbModel dbModel)
    {
        return new BackupConfiguration(
            id: dbModel.Id,
            isEnabled: dbModel.IsEnabled,
            provider: dbModel.Provider,
            schedule: dbModel.Schedule,
            googleDriveFolderId: dbModel.Provider == BackupProvider.GoogleDrive ? dbModel.FolderId : null,
            googleDriveFolderName: dbModel.Provider == BackupProvider.GoogleDrive ? dbModel.FolderName : null,
            serviceAccountEmail: dbModel.ServiceAccountEmail,
            encryptedCredentials: dbModel.EncryptedCredentials,
            lastBackupAt: dbModel.LastBackupAt,
            lastBackupStatus: dbModel.LastBackupStatus,
            lastBackupError: dbModel.LastBackupError,
            totalFilesBackedUp: dbModel.TotalFilesBackedUp,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt
        );
    }

    public static BackupConfigurationDbModel MapToDbModel(this BackupConfiguration domain)
    {
        return new BackupConfigurationDbModel
        {
            Id = domain.Id,
            IsEnabled = domain.IsEnabled,
            Provider = domain.Provider,
            Schedule = domain.Schedule,
            FolderId = domain.GoogleDriveFolderId,
            FolderName = domain.GoogleDriveFolderName,
            ServiceAccountEmail = domain.ServiceAccountEmail,
            EncryptedCredentials = domain.EncryptedCredentials,
            LastBackupAt = domain.LastBackupAt,
            LastBackupStatus = domain.LastBackupStatus,
            LastBackupError = domain.LastBackupError,
            TotalFilesBackedUp = domain.TotalFilesBackedUp,
            CreatedAt = domain.CreatedAt,
            UpdatedAt = domain.UpdatedAt
        };
    }

    public static void UpdateFrom(this BackupConfigurationDbModel dbModel, BackupConfiguration domain)
    {
        dbModel.IsEnabled = domain.IsEnabled;
        dbModel.Provider = domain.Provider;
        dbModel.Schedule = domain.Schedule;
        dbModel.FolderId = domain.GoogleDriveFolderId;
        dbModel.FolderName = domain.GoogleDriveFolderName;
        dbModel.ServiceAccountEmail = domain.ServiceAccountEmail;
        dbModel.EncryptedCredentials = domain.EncryptedCredentials;
        dbModel.LastBackupAt = domain.LastBackupAt;
        dbModel.LastBackupStatus = domain.LastBackupStatus;
        dbModel.LastBackupError = domain.LastBackupError;
        dbModel.TotalFilesBackedUp = domain.TotalFilesBackedUp;
        dbModel.UpdatedAt = domain.UpdatedAt;
    }

    public static BackupHistory MapToDomain(this BackupHistoryDbModel dbModel)
    {
        return new BackupHistory(
            id: dbModel.Id,
            backupConfigurationId: dbModel.BackupConfigurationId,
            startedAt: dbModel.StartedAt,
            completedAt: dbModel.CompletedAt,
            status: dbModel.Status,
            filesProcessed: dbModel.FilesProcessed,
            filesUploaded: dbModel.FilesUploaded,
            filesSkipped: dbModel.FilesSkipped,
            filesFailed: dbModel.FilesFailed,
            totalBytesUploaded: dbModel.TotalBytesUploaded,
            errorMessage: dbModel.ErrorMessage,
            errorDetails: dbModel.ErrorDetails
        );
    }

    public static BackupHistoryDbModel MapToDbModel(this BackupHistory domain)
    {
        return new BackupHistoryDbModel
        {
            Id = domain.Id,
            BackupConfigurationId = domain.BackupConfigurationId,
            StartedAt = domain.StartedAt,
            CompletedAt = domain.CompletedAt,
            Status = domain.Status,
            FilesProcessed = domain.FilesProcessed,
            FilesUploaded = domain.FilesUploaded,
            FilesSkipped = domain.FilesSkipped,
            FilesFailed = domain.FilesFailed,
            TotalBytesUploaded = domain.TotalBytesUploaded,
            ErrorMessage = domain.ErrorMessage,
            ErrorDetails = domain.ErrorDetails
        };
    }

    public static void UpdateFrom(this BackupHistoryDbModel dbModel, BackupHistory domain)
    {
        dbModel.CompletedAt = domain.CompletedAt;
        dbModel.Status = domain.Status;
        dbModel.FilesProcessed = domain.FilesProcessed;
        dbModel.FilesUploaded = domain.FilesUploaded;
        dbModel.FilesSkipped = domain.FilesSkipped;
        dbModel.FilesFailed = domain.FilesFailed;
        dbModel.TotalBytesUploaded = domain.TotalBytesUploaded;
        dbModel.ErrorMessage = domain.ErrorMessage;
        dbModel.ErrorDetails = domain.ErrorDetails;
    }

    public static IReadOnlyList<BackupHistory> MapToDomain(this IEnumerable<BackupHistoryDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }
}
