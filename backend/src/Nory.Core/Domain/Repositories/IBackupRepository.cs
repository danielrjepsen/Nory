using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;

namespace Nory.Core.Domain.Repositories;

public interface IBackupRepository
{
    Task<BackupConfiguration?> GetConfigurationAsync(CancellationToken cancellationToken = default);
    Task<bool> HasConfigurationAsync(CancellationToken cancellationToken = default);
    void AddConfiguration(BackupConfiguration configuration);
    void UpdateConfiguration(BackupConfiguration configuration);
    void DeleteConfiguration(BackupConfiguration configuration);
    Task<bool> TryAcquireBackupLockAsync(Guid configurationId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<BackupHistory>> GetHistoryAsync(int limit = 10, CancellationToken cancellationToken = default);
    Task<BackupHistory?> GetHistoryByIdAsync(Guid id, CancellationToken cancellationToken = default);
    void AddHistory(BackupHistory history);
    void UpdateHistory(BackupHistory history);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
