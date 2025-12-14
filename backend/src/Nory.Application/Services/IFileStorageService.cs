namespace Nory.Application.Services;

/// <summary>
/// Service for storing and retrieving files
/// </summary>
public interface IFileStorageService
{
    /// <summary>
    /// Store a file and return the storage path
    /// </summary>
    /// <param name="fileStream">The file stream</param>
    /// <param name="fileName">Original file name</param>
    /// <param name="contentType">MIME type</param>
    /// <param name="eventId">Event GUID</param>
    /// <param name="eventName">Event name (for humanreadable folder)</param>
    /// <param name="storageCategory">Category folder</param>
    Task<FileStorageResult> StoreFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        Guid eventId,
        string eventName,
        string storageCategory = "events",
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Get file stream by storage path
    /// </summary>
    Task<FileRetrievalResult?> GetFileAsync(
        string storagePath,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Delete a file by storage path
    /// </summary>
    Task<bool> DeleteFileAsync(string storagePath, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if file exists
    /// </summary>
    Task<bool> FileExistsAsync(string storagePath, CancellationToken cancellationToken = default);
}

public record FileStorageResult(bool Success, string StoragePath, string? ErrorMessage = null);

public record FileRetrievalResult(
    Stream FileStream,
    string ContentType,
    string FileName,
    long FileSize
);
