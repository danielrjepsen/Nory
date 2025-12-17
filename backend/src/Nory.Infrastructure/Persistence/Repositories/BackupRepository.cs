using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class BackupRepository : IBackupRepository
{
    private readonly ApplicationDbContext _context;

    public BackupRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<BackupConfiguration?> GetConfigurationAsync(CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.BackupConfigurations
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<bool> HasConfigurationAsync(CancellationToken cancellationToken = default)
    {
        return await _context.BackupConfigurations.AnyAsync(cancellationToken);
    }

    public void AddConfiguration(BackupConfiguration configuration)
    {
        var dbModel = configuration.MapToDbModel();
        _context.BackupConfigurations.Add(dbModel);
    }

    public void UpdateConfiguration(BackupConfiguration configuration)
    {
        var dbModel = configuration.MapToDbModel();
        _context.BackupConfigurations.Update(dbModel);
    }

    public void DeleteConfiguration(BackupConfiguration configuration)
    {
        var dbModel = configuration.MapToDbModel();
        _context.BackupConfigurations.Remove(dbModel);
    }

    private static readonly TimeSpan StaleLockTimeout = TimeSpan.FromHours(2);

    public async Task<bool> TryAcquireBackupLockAsync(Guid configurationId, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var staleThreshold = now - StaleLockTimeout;

        var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
            $@"UPDATE ""BackupConfigurations""
               SET ""LastBackupStatus"" = {(int)BackupStatus.InProgress},
                   ""LastBackupError"" = NULL,
                   ""UpdatedAt"" = {now}
               WHERE ""Id"" = {configurationId}
                 AND (
                     ""LastBackupStatus"" != {(int)BackupStatus.InProgress}
                     OR ""UpdatedAt"" < {staleThreshold}
                 )",
            cancellationToken);

        return rowsAffected > 0;
    }

    public async Task<IReadOnlyList<BackupHistory>> GetHistoryAsync(int limit = 10, CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.BackupHistory
            .OrderByDescending(h => h.StartedAt)
            .Take(limit)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<BackupHistory?> GetHistoryByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.BackupHistory
            .AsNoTracking()
            .FirstOrDefaultAsync(h => h.Id == id, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public void AddHistory(BackupHistory history)
    {
        var dbModel = history.MapToDbModel();
        _context.BackupHistory.Add(dbModel);
    }

    public void UpdateHistory(BackupHistory history)
    {
        var dbModel = history.MapToDbModel();
        _context.BackupHistory.Update(dbModel);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
