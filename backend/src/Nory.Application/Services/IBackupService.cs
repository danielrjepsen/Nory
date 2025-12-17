using Nory.Application.Common;
using Nory.Application.DTOs.Backup;

namespace Nory.Application.Services;

public interface IBackupService
{
    Task<Result<BackupConfigurationDto>> ConfigureAsync(
        ConfigureBackupCommand command,
        CancellationToken cancellationToken = default);

    Task<Result<BackupConfigurationDto>> UpdateConfigurationAsync(
        UpdateBackupCommand command,
        CancellationToken cancellationToken = default);

    Task<Result<BackupConfigurationDto>> GetConfigurationAsync(
        CancellationToken cancellationToken = default);

    Task<Result<TestConnectionResult>> TestConnectionAsync(
        CancellationToken cancellationToken = default);

    Task<Result<BackupRunResult>> RunBackupAsync(
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<BackupHistoryDto>>> GetHistoryAsync(
        int limit = 10,
        CancellationToken cancellationToken = default);

    Task<Result> DisableAsync(
        CancellationToken cancellationToken = default);
}
