using System.Net;
using System.Text.Json;
using Google;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Upload;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs.Backup;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence;
using File = Google.Apis.Drive.v3.Data.File;

namespace Nory.Infrastructure.Services;

public class BackupService : IBackupService
{
    private readonly IBackupRepository _backupRepository;
    private readonly IEncryptionService _encryptionService;
    private readonly IFileStorageService _fileStorageService;
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<BackupService> _logger;
    private const string ApplicationName = "Nory Event Gallery Backup";

    // Google Drive API best practices: retry with exponential backoff
    private const int MaxRetries = 3;
    private static readonly TimeSpan InitialBackoff = TimeSpan.FromSeconds(1);
    private const int BackoffMultiplier = 2;

    public BackupService(
        IBackupRepository backupRepository,
        IEncryptionService encryptionService,
        IFileStorageService fileStorageService,
        ApplicationDbContext dbContext,
        ILogger<BackupService> logger)
    {
        _backupRepository = backupRepository;
        _encryptionService = encryptionService;
        _fileStorageService = fileStorageService;
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<Result<BackupConfigurationDto>> ConfigureAsync(
        ConfigureBackupCommand command,
        CancellationToken cancellationToken = default)
    {
        var existingConfig = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (existingConfig is not null)
        {
            return Result<BackupConfigurationDto>.BadRequest("Backup is already configured. Use update or disable first.");
        }

        if (!ValidateServiceAccountJson(command.ServiceAccountJson, out var email, out var error))
        {
            return Result<BackupConfigurationDto>.BadRequest($"Invalid service account JSON: {error}");
        }

        var encryptedCredentials = _encryptionService.Encrypt(command.ServiceAccountJson);

        var config = BackupConfiguration.CreateGoogleDrive(
            folderName: command.FolderName,
            serviceAccountEmail: email,
            encryptedCredentials: encryptedCredentials,
            schedule: command.Schedule
        );

        _backupRepository.AddConfiguration(config);
        await _backupRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Backup configured with provider {Provider}", command.Provider);

        return Result<BackupConfigurationDto>.Success(MapToDto(config));
    }

    public async Task<Result<BackupConfigurationDto>> UpdateConfigurationAsync(
        UpdateBackupCommand command,
        CancellationToken cancellationToken = default)
    {
        var config = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (config is null)
        {
            return Result<BackupConfigurationDto>.NotFound("No backup configuration found");
        }

        config.UpdateConfiguration(command.FolderName, command.Schedule);
        _backupRepository.UpdateConfiguration(config);
        await _backupRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Backup configuration updated");

        return Result<BackupConfigurationDto>.Success(MapToDto(config));
    }

    public async Task<Result<BackupConfigurationDto>> GetConfigurationAsync(
        CancellationToken cancellationToken = default)
    {
        var config = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (config is null)
        {
            return Result<BackupConfigurationDto>.NotFound("No backup configuration found");
        }

        return Result<BackupConfigurationDto>.Success(MapToDto(config));
    }

    public async Task<Result<TestConnectionResult>> TestConnectionAsync(
        CancellationToken cancellationToken = default)
    {
        var config = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (config is null)
        {
            return Result<TestConnectionResult>.NotFound("No backup configuration found");
        }

        try
        {
            var driveService = CreateDriveService(config.EncryptedCredentials!);
            var folderId = await EnsureBackupFolderExists(
                driveService,
                config.GoogleDriveFolderName!,
                cancellationToken);

            if (config.GoogleDriveFolderId != folderId)
            {
                config.SetGoogleDriveFolderId(folderId);
                _backupRepository.UpdateConfiguration(config);
                await _backupRepository.SaveChangesAsync(cancellationToken);
            }

            return Result<TestConnectionResult>.Success(new TestConnectionResult(true, folderId, null));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to test Google Drive connection");
            return Result<TestConnectionResult>.Success(new TestConnectionResult(false, null, ex.Message));
        }
    }

    public async Task<Result<BackupRunResult>> RunBackupAsync(
        CancellationToken cancellationToken = default)
    {
        var config = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (config is null)
        {
            return Result<BackupRunResult>.NotFound("No backup configuration found");
        }

        if (!config.IsEnabled)
        {
            return Result<BackupRunResult>.BadRequest("Backup is disabled");
        }

        // Prevent rapid successive backups (minimum 1 minute between runs)
        // Check this before acquiring lock to fail fast
        if (config.LastBackupAt.HasValue &&
            config.LastBackupStatus != BackupStatus.InProgress &&
            DateTime.UtcNow - config.LastBackupAt.Value < TimeSpan.FromMinutes(1))
        {
            return Result<BackupRunResult>.BadRequest("Please wait at least 1 minute between backup runs");
        }

        // Atomically acquire lock - prevents race conditions where two concurrent
        // requests both see "not in progress" and both try to start
        var lockAcquired = await _backupRepository.TryAcquireBackupLockAsync(config.Id, cancellationToken);
        if (!lockAcquired)
        {
            return Result<BackupRunResult>.BadRequest("A backup is already in progress");
        }

        // Re-fetch config after lock acquisition to get updated state
        config = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (config is null)
        {
            return Result<BackupRunResult>.NotFound("Configuration was deleted during lock acquisition");
        }

        var history = BackupHistory.Start(config.Id);
        _backupRepository.AddHistory(history);
        await _backupRepository.SaveChangesAsync(cancellationToken);

        DriveService? driveService = null;
        try
        {
            driveService = CreateDriveService(config.EncryptedCredentials!);
            var rootFolderId = await EnsureBackupFolderExists(
                driveService,
                config.GoogleDriveFolderName!,
                cancellationToken);

            if (config.GoogleDriveFolderId != rootFolderId)
            {
                config.SetGoogleDriveFolderId(rootFolderId);
            }

            // Stream photos to avoid loading all into memory for large backups
            await foreach (var photo in GetPhotosToBackupStreamAsync(config.LastBackupAt, cancellationToken))
            {
                try
                {
                    var eventFolderId = await EnsureEventFolderExists(
                        driveService,
                        rootFolderId,
                        photo.EventName,
                        photo.CreatedAt,
                        cancellationToken);

                    var fileResult = await _fileStorageService.GetFileAsync(photo.StoragePath, cancellationToken);
                    if (fileResult is null)
                    {
                        _logger.LogWarning("File not found for photo {PhotoId}: {Path}", photo.Id, photo.StoragePath);
                        history.RecordFileSkipped();
                        continue;
                    }

                    // Ensure stream is disposed after upload
                    await using (fileResult.FileStream)
                    {
                        await UploadFileToDrive(
                            driveService,
                            eventFolderId,
                            photo.OriginalFileName,
                            photo.ContentType,
                            fileResult.FileStream,
                            cancellationToken);
                    }

                    history.RecordFileUploaded(photo.FileSizeBytes);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to backup photo {PhotoId}", photo.Id);
                    history.RecordFileFailed();
                }
            }

            history.Complete();
            config.RecordBackupSuccess(history.FilesUploaded);
            _backupRepository.UpdateHistory(history);
            _backupRepository.UpdateConfiguration(config);
            await _backupRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Backup completed: {Uploaded} uploaded, {Skipped} skipped, {Failed} failed",
                history.FilesUploaded, history.FilesSkipped, history.FilesFailed);

            return Result<BackupRunResult>.Success(new BackupRunResult(
                true,
                history.FilesUploaded,
                history.FilesSkipped,
                history.FilesFailed,
                history.TotalBytesUploaded,
                null));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Backup failed");

            history.Fail(ex.Message, ex.StackTrace);
            config.RecordBackupFailure(ex.Message);
            _backupRepository.UpdateHistory(history);
            _backupRepository.UpdateConfiguration(config);
            await _backupRepository.SaveChangesAsync(cancellationToken);

            return Result<BackupRunResult>.Success(new BackupRunResult(
                false, 0, 0, 0, 0, ex.Message));
        }
        finally
        {
            // DriveService implements IDisposable - must be disposed
            driveService?.Dispose();
        }
    }

    public async Task<Result<IReadOnlyList<BackupHistoryDto>>> GetHistoryAsync(
        int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var history = await _backupRepository.GetHistoryAsync(limit, cancellationToken);
        var dtos = history.Select(h => new BackupHistoryDto(
            h.Id,
            h.StartedAt,
            h.CompletedAt,
            h.Status,
            h.FilesProcessed,
            h.FilesUploaded,
            h.FilesSkipped,
            h.FilesFailed,
            h.TotalBytesUploaded,
            h.ErrorMessage
        )).ToList();

        return Result<IReadOnlyList<BackupHistoryDto>>.Success(dtos);
    }

    public async Task<Result> DisableAsync(CancellationToken cancellationToken = default)
    {
        var config = await _backupRepository.GetConfigurationAsync(cancellationToken);
        if (config is null)
        {
            return Result.NotFound("No backup configuration found");
        }

        _backupRepository.DeleteConfiguration(config);
        await _backupRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Backup configuration deleted");

        return Result.Success();
    }

    private DriveService CreateDriveService(string encryptedCredentials)
    {
        var credentialsJson = _encryptionService.Decrypt(encryptedCredentials);
        var credential = GoogleCredential
            .FromJson(credentialsJson)
            .CreateScoped(DriveService.Scope.DriveFile);

        return new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = ApplicationName
        });
    }

    private async Task<string> EnsureBackupFolderExists(
        DriveService driveService,
        string folderName,
        CancellationToken cancellationToken)
    {
        var request = driveService.Files.List();
        // Escape single quotes to prevent query injection
        var sanitizedName = SanitizeForDriveQuery(folderName);
        request.Q = $"name = '{sanitizedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        request.Fields = "files(id, name)";

        var result = await request.ExecuteAsync(cancellationToken);
        if (result.Files.Count > 0)
        {
            return result.Files[0].Id;
        }

        var folderMetadata = new File
        {
            Name = folderName,
            MimeType = "application/vnd.google-apps.folder"
        };

        var createRequest = driveService.Files.Create(folderMetadata);
        createRequest.Fields = "id";
        var folder = await createRequest.ExecuteAsync(cancellationToken);

        return folder.Id;
    }

    private async Task<string> EnsureEventFolderExists(
        DriveService driveService,
        string parentFolderId,
        string eventName,
        DateTime photoDate,
        CancellationToken cancellationToken)
    {
        var year = photoDate.Year.ToString();
        var month = photoDate.ToString("MM-MMMM");

        var eventFolderId = await EnsureSubFolderExists(driveService, parentFolderId, eventName, cancellationToken);
        var yearFolderId = await EnsureSubFolderExists(driveService, eventFolderId, year, cancellationToken);
        var monthFolderId = await EnsureSubFolderExists(driveService, yearFolderId, month, cancellationToken);

        return monthFolderId;
    }

    private async Task<string> EnsureSubFolderExists(
        DriveService driveService,
        string parentFolderId,
        string folderName,
        CancellationToken cancellationToken)
    {
        var request = driveService.Files.List();
        // Escape single quotes to prevent query injection
        var sanitizedName = SanitizeForDriveQuery(folderName);
        request.Q = $"name = '{sanitizedName}' and '{parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        request.Fields = "files(id, name)";

        var result = await request.ExecuteAsync(cancellationToken);
        if (result.Files.Count > 0)
        {
            return result.Files[0].Id;
        }

        var folderMetadata = new File
        {
            Name = folderName,
            MimeType = "application/vnd.google-apps.folder",
            Parents = new List<string> { parentFolderId }
        };

        var createRequest = driveService.Files.Create(folderMetadata);
        createRequest.Fields = "id";
        var folder = await createRequest.ExecuteAsync(cancellationToken);

        return folder.Id;
    }

    private async Task UploadFileToDrive(
        DriveService driveService,
        string folderId,
        string fileName,
        string contentType,
        Stream fileStream,
        CancellationToken cancellationToken)
    {
        // Check if file already exists (duplicate detection)
        var existingFileId = await CheckFileExistsAsync(driveService, folderId, fileName, cancellationToken);
        if (existingFileId is not null)
        {
            _logger.LogDebug("File {FileName} already exists in folder, skipping upload", fileName);
            return;
        }

        var fileMetadata = new File
        {
            Name = fileName,
            Parents = new List<string> { folderId }
        };

        // Retry with exponential backoff for transient errors
        var backoff = InitialBackoff;
        Exception? lastException = null;

        for (var attempt = 1; attempt <= MaxRetries; attempt++)
        {
            try
            {
                // Reset stream position for retry
                if (fileStream.CanSeek)
                {
                    fileStream.Position = 0;
                }

                var uploadRequest = driveService.Files.Create(fileMetadata, fileStream, contentType);
                uploadRequest.Fields = "id";

                var progress = await uploadRequest.UploadAsync(cancellationToken);
                if (progress.Status == UploadStatus.Completed)
                {
                    return; // Success
                }

                if (progress.Exception != null)
                {
                    throw progress.Exception;
                }
            }
            catch (OperationCanceledException)
            {
                // Don't retry on cancellation - rethrow immediately
                throw;
            }
            catch (GoogleApiException ex) when (IsRetryableError(ex) && attempt < MaxRetries)
            {
                lastException = ex;
                _logger.LogWarning(
                    "Upload attempt {Attempt}/{MaxRetries} failed with retryable Google API error: {Message}. Retrying in {Delay}ms",
                    attempt, MaxRetries, ex.Message, backoff.TotalMilliseconds);

                await Task.Delay(backoff, cancellationToken);
                backoff *= BackoffMultiplier;
            }
            catch (HttpRequestException ex) when (attempt < MaxRetries)
            {
                // Network errors are retryable
                lastException = ex;
                _logger.LogWarning(
                    "Upload attempt {Attempt}/{MaxRetries} failed with network error: {Message}. Retrying in {Delay}ms",
                    attempt, MaxRetries, ex.Message, backoff.TotalMilliseconds);

                await Task.Delay(backoff, cancellationToken);
                backoff *= BackoffMultiplier;
            }
            catch (Exception ex) when (attempt == MaxRetries)
            {
                // Final attempt failed - throw with context
                lastException = ex;
                break;
            }
        }

        throw new InvalidOperationException(
            $"Failed to upload file {fileName} after {MaxRetries} attempts",
            lastException);
    }

    private async Task<string?> CheckFileExistsAsync(
        DriveService driveService,
        string folderId,
        string fileName,
        CancellationToken cancellationToken)
    {
        var sanitizedName = SanitizeForDriveQuery(fileName);
        var request = driveService.Files.List();
        request.Q = $"name = '{sanitizedName}' and '{folderId}' in parents and trashed = false";
        request.Fields = "files(id)";

        var result = await request.ExecuteAsync(cancellationToken);
        return result.Files.Count > 0 ? result.Files[0].Id : null;
    }

    private static bool IsRetryableError(GoogleApiException ex)
    {
        // Retry on rate limit exceeded (403/429) and server errors (5xx)
        return ex.HttpStatusCode switch
        {
            HttpStatusCode.TooManyRequests => true, // 429
            HttpStatusCode.Forbidden when ex.Error?.Errors?.Any(e =>
                e.Reason == "rateLimitExceeded" ||
                e.Reason == "userRateLimitExceeded") == true => true,
            HttpStatusCode.InternalServerError => true, // 500
            HttpStatusCode.BadGateway => true, // 502
            HttpStatusCode.ServiceUnavailable => true, // 503
            HttpStatusCode.GatewayTimeout => true, // 504
            _ => false
        };
    }

    /// <summary>
    /// Streams photos to backup using IAsyncEnumerable to avoid loading all into memory.
    /// Essential for large backups with thousands of photos.
    /// </summary>
    private async IAsyncEnumerable<PhotoBackupInfo> GetPhotosToBackupStreamAsync(
        DateTime? lastBackupAt,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var query = _dbContext.EventPhotos
            .Include(p => p.Event)
            .Where(p => p.Event != null && p.Event.Status != EventStatus.Archived);

        if (lastBackupAt.HasValue)
        {
            query = query.Where(p => p.CreatedAt > lastBackupAt.Value);
        }

        var projection = query
            .OrderBy(p => p.CreatedAt)
            .Select(p => new PhotoBackupInfo(
                p.Id,
                p.Event!.Name,
                p.OriginalFileName,
                p.ContentType,
                p.StoragePath,
                p.FileSizeBytes,
                p.CreatedAt));

        // Stream results instead of loading all into memory
        await foreach (var photo in projection.AsAsyncEnumerable().WithCancellation(cancellationToken))
        {
            yield return photo;
        }
    }

    private static bool ValidateServiceAccountJson(string json, out string email, out string error)
    {
        email = string.Empty;
        error = string.Empty;

        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (!root.TryGetProperty("type", out var typeElement) ||
                typeElement.GetString() != "service_account")
            {
                error = "JSON must be a service account credential";
                return false;
            }

            if (!root.TryGetProperty("client_email", out var emailElement))
            {
                error = "client_email field is missing";
                return false;
            }

            email = emailElement.GetString() ?? string.Empty;

            if (!root.TryGetProperty("private_key", out _))
            {
                error = "private_key field is missing";
                return false;
            }

            return true;
        }
        catch (JsonException ex)
        {
            error = $"Invalid JSON: {ex.Message}";
            return false;
        }
    }

    private static BackupConfigurationDto MapToDto(BackupConfiguration config)
    {
        return new BackupConfigurationDto(
            config.Id,
            config.IsEnabled,
            config.Provider,
            config.Schedule,
            config.GoogleDriveFolderName,
            config.GoogleDriveFolderId,
            config.ServiceAccountEmail,
            config.LastBackupAt,
            config.LastBackupStatus,
            config.LastBackupError,
            config.TotalFilesBackedUp,
            config.CreatedAt,
            config.UpdatedAt
        );
    }

    /// <summary>
    /// Sanitizes a string for use in Google Drive query strings.
    /// Escapes single quotes and backslashes to prevent query injection.
    /// </summary>
    private static string SanitizeForDriveQuery(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        // Google Drive API uses backslash to escape single quotes in queries
        return input
            .Replace("\\", "\\\\")
            .Replace("'", "\\'");
    }

    private record PhotoBackupInfo(
        Guid Id,
        string EventName,
        string OriginalFileName,
        string ContentType,
        string StoragePath,
        long FileSizeBytes,
        DateTime CreatedAt
    );
}
