namespace Nory.Core.Domain.Entities;

using Nory.Core.Domain.Enums;

public class BackupConfiguration
{
    public Guid Id { get; private set; }
    public bool IsEnabled { get; private set; }
    public BackupProvider Provider { get; private set; }
    public BackupSchedule Schedule { get; private set; }
    public string? GoogleDriveFolderId { get; private set; }
    public string? GoogleDriveFolderName { get; private set; }
    public string? ServiceAccountEmail { get; private set; }
    public string? EncryptedCredentials { get; private set; }
    public DateTime? LastBackupAt { get; private set; }
    public BackupStatus LastBackupStatus { get; private set; }
    public string? LastBackupError { get; private set; }
    public int TotalFilesBackedUp { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private BackupConfiguration() { }

    public BackupConfiguration(
        Guid id,
        bool isEnabled,
        BackupProvider provider,
        BackupSchedule schedule,
        string? googleDriveFolderId,
        string? googleDriveFolderName,
        string? serviceAccountEmail,
        string? encryptedCredentials,
        DateTime? lastBackupAt,
        BackupStatus lastBackupStatus,
        string? lastBackupError,
        int totalFilesBackedUp,
        DateTime createdAt,
        DateTime updatedAt)
    {
        Id = id;
        IsEnabled = isEnabled;
        Provider = provider;
        Schedule = schedule;
        GoogleDriveFolderId = googleDriveFolderId;
        GoogleDriveFolderName = googleDriveFolderName;
        ServiceAccountEmail = serviceAccountEmail;
        EncryptedCredentials = encryptedCredentials;
        LastBackupAt = lastBackupAt;
        LastBackupStatus = lastBackupStatus;
        LastBackupError = lastBackupError;
        TotalFilesBackedUp = totalFilesBackedUp;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static BackupConfiguration CreateGoogleDrive(
        string folderName,
        string serviceAccountEmail,
        string encryptedCredentials,
        BackupSchedule schedule = BackupSchedule.Daily)
    {
        ValidateFolderName(folderName);
        ValidateServiceAccountEmail(serviceAccountEmail);

        if (string.IsNullOrWhiteSpace(encryptedCredentials))
            throw new ArgumentException("Encrypted credentials are required", nameof(encryptedCredentials));

        return new BackupConfiguration(
            id: Guid.NewGuid(),
            isEnabled: true,
            provider: BackupProvider.GoogleDrive,
            schedule: schedule,
            googleDriveFolderId: null,
            googleDriveFolderName: folderName.Trim(),
            serviceAccountEmail: serviceAccountEmail.Trim(),
            encryptedCredentials: encryptedCredentials,
            lastBackupAt: null,
            lastBackupStatus: BackupStatus.None,
            lastBackupError: null,
            totalFilesBackedUp: 0,
            createdAt: DateTime.UtcNow,
            updatedAt: DateTime.UtcNow
        );
    }

    public void UpdateConfiguration(
        string? folderName = null,
        BackupSchedule? schedule = null)
    {
        if (folderName is not null)
        {
            ValidateFolderName(folderName);
            GoogleDriveFolderName = folderName.Trim();
        }

        if (schedule.HasValue)
            Schedule = schedule.Value;

        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateCredentials(
        string serviceAccountEmail,
        string encryptedCredentials)
    {
        ValidateServiceAccountEmail(serviceAccountEmail);

        if (string.IsNullOrWhiteSpace(encryptedCredentials))
            throw new ArgumentException("Encrypted credentials are required", nameof(encryptedCredentials));

        ServiceAccountEmail = serviceAccountEmail.Trim();
        EncryptedCredentials = encryptedCredentials;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetGoogleDriveFolderId(string folderId)
    {
        if (string.IsNullOrWhiteSpace(folderId))
            throw new ArgumentException("Folder ID is required", nameof(folderId));

        GoogleDriveFolderId = folderId.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Enable()
    {
        IsEnabled = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Disable()
    {
        IsEnabled = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordBackupStarted()
    {
        LastBackupStatus = BackupStatus.InProgress;
        LastBackupError = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordBackupSuccess(int filesBackedUp)
    {
        LastBackupAt = DateTime.UtcNow;
        LastBackupStatus = BackupStatus.Success;
        LastBackupError = null;
        TotalFilesBackedUp += filesBackedUp;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordBackupFailure(string error)
    {
        LastBackupAt = DateTime.UtcNow;
        LastBackupStatus = BackupStatus.Failed;
        LastBackupError = error;
        UpdatedAt = DateTime.UtcNow;
    }

    private static void ValidateFolderName(string folderName)
    {
        if (string.IsNullOrWhiteSpace(folderName))
            throw new ArgumentException("Folder name is required", nameof(folderName));

        if (folderName.Length > 200)
            throw new ArgumentException("Folder name cannot exceed 200 characters", nameof(folderName));

        // Block path traversal and dangerous characters
        var invalidChars = new[] { '/', '\\', '\0', '\n', '\r', '<', '>', ':', '"', '|', '?', '*' };
        if (folderName.IndexOfAny(invalidChars) >= 0)
            throw new ArgumentException("Folder name contains invalid characters", nameof(folderName));

        // Block path traversal attempts
        if (folderName.Contains("..") || folderName.Trim().StartsWith('.'))
            throw new ArgumentException("Folder name cannot contain path traversal sequences", nameof(folderName));
    }

    private static void ValidateServiceAccountEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Service account email is required", nameof(email));

        if (!email.Contains('@'))
            throw new ArgumentException("Invalid service account email format", nameof(email));
    }
}
