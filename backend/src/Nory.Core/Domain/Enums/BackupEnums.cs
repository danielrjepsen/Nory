namespace Nory.Core.Domain.Enums;

public enum BackupSchedule
{
    Daily = 0,
    Weekly = 1,
    Manual = 2,
}

public enum BackupStatus
{
    None = 0,
    InProgress = 1,
    Success = 2,
    Failed = 3,
}

public enum BackupProvider
{
    None = 0,
    GoogleDrive = 1,
    // OneDrive = 2 - todo
}
