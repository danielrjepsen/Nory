using Microsoft.Extensions.Logging;
using Nory.Application.Services;

namespace Nory.Infrastructure.Jobs;

public class BackupJob
{
    private readonly IBackupService _backupService;
    private readonly ILogger<BackupJob> _logger;

    public BackupJob(IBackupService backupService, ILogger<BackupJob> logger)
    {
        _backupService = backupService;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Starting scheduled backup job");

        try
        {
            var result = await _backupService.RunBackupAsync();

            if (result.IsSuccess && result.Data!.Success)
            {
                _logger.LogInformation(
                    "Scheduled backup completed successfully: {Uploaded} files uploaded, {Skipped} skipped, {Failed} failed",
                    result.Data.FilesUploaded,
                    result.Data.FilesSkipped,
                    result.Data.FilesFailed);
            }
            else if (result.IsSuccess && !result.Data!.Success)
            {
                _logger.LogWarning("Scheduled backup failed: {Error}", result.Data.ErrorMessage);
            }
            else
            {
                _logger.LogWarning("Scheduled backup could not run: {Error}", result.Error);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Scheduled backup job failed with exception");
        }
    }
}
