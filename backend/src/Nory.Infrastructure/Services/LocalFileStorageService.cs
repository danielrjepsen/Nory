using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Nory.Application.Services;
using Nory.Infrastructure.Utilities;

namespace Nory.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private const int BufferSize = 81920;
    private const int ShortGuidLength = 8;

    private readonly FileStorageOptions _options;
    private readonly HashSet<string> _allowedContentTypes;
    private readonly HashSet<string> _allowedExtensions;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(
        IOptions<FileStorageOptions> options,
        ILogger<LocalFileStorageService> logger)
    {
        _options = options.Value;
        _logger = logger;

        _allowedContentTypes = new HashSet<string>(
            _options.AllowedImageContentTypes.Concat(_options.AllowedVideoContentTypes),
            StringComparer.OrdinalIgnoreCase);

        _allowedExtensions = new HashSet<string>(
            _options.AllowedExtensions,
            StringComparer.OrdinalIgnoreCase);

        EnsureDirectoryExists(_options.BasePath);
    }

    public async Task<FileStorageResult> StoreFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        Guid eventId,
        string eventName,
        string storageCategory = "events",
        CancellationToken cancellationToken = default)
    {
        try
        {
            var validationError = ValidateFile(fileName, contentType, fileStream.Length);
            if (validationError is not null)
                return new FileStorageResult(false, string.Empty, validationError);

            var storagePath = BuildStoragePath(fileName, eventId, eventName, storageCategory);
            var fullPath = Path.Combine(_options.BasePath, storagePath);

            EnsureDirectoryExists(Path.GetDirectoryName(fullPath)!);

            await WriteFileAsync(fullPath, fileStream, cancellationToken);

            _logger.LogDebug(
                "Stored file: {FileName} -> {StoragePath} ({Size} bytes)",
                fileName, storagePath, fileStream.Length);

            return new FileStorageResult(true, storagePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to store file: {FileName}", fileName);
            return new FileStorageResult(false, string.Empty, "Failed to store file");
        }
    }

    public Task<FileRetrievalResult?> GetFileAsync(
        string storagePath,
        CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_options.BasePath, storagePath);

        if (!IsPathSafe(fullPath))
        {
            _logger.LogWarning("Path traversal attempt: {Path}", storagePath);
            return Task.FromResult<FileRetrievalResult?>(null);
        }

        if (!File.Exists(fullPath))
            return Task.FromResult<FileRetrievalResult?>(null);

        var fileInfo = new FileInfo(fullPath);
        var contentType = ContentTypeMapper.GetContentType(fileInfo.Extension);
        var stream = new FileStream(
            fullPath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            BufferSize,
            useAsync: true);

        return Task.FromResult<FileRetrievalResult?>(
            new FileRetrievalResult(stream, contentType, fileInfo.Name, fileInfo.Length));
    }

    public Task<bool> DeleteFileAsync(
        string storagePath,
        CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_options.BasePath, storagePath);

        if (!IsPathSafe(fullPath))
        {
            _logger.LogWarning("Path traversal attempt on delete: {Path}", storagePath);
            return Task.FromResult(false);
        }

        if (!File.Exists(fullPath))
            return Task.FromResult(false);

        File.Delete(fullPath);
        _logger.LogDebug("Deleted file: {Path}", storagePath);
        return Task.FromResult(true);
    }

    public Task<bool> FileExistsAsync(
        string storagePath,
        CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_options.BasePath, storagePath);
        return Task.FromResult(IsPathSafe(fullPath) && File.Exists(fullPath));
    }

    private string? ValidateFile(string fileName, string contentType, long fileSize)
    {
        if (!_allowedContentTypes.Contains(contentType))
        {
            _logger.LogWarning("Invalid content type: {ContentType}", contentType);
            return "Invalid file type";
        }

        var extension = Path.GetExtension(fileName);
        if (!_allowedExtensions.Contains(extension))
        {
            _logger.LogWarning("Invalid file extension: {Extension}", extension);
            return "Invalid file extension";
        }

        var isVideo = ContentTypeMapper.IsVideo(contentType);
        var maxSize = isVideo ? _options.MaxVideoSizeBytes : _options.MaxImageSizeBytes;
        var maxSizeLabel = isVideo ? _options.MaxVideoSizeLabel : _options.MaxImageSizeLabel;

        if (fileSize > maxSize)
        {
            _logger.LogWarning("File too large: {Size} bytes (max {MaxSize})", fileSize, maxSizeLabel);
            return $"File too large (max {maxSizeLabel})";
        }

        return null;
    }

    private static string BuildStoragePath(string fileName, Guid eventId, string eventName, string storageCategory)
    {
        var now = DateTime.UtcNow;
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var eventSlug = SlugGenerator.Create(eventName);
        var shortGuid = eventId.ToString()[..ShortGuidLength];
        var eventFolder = $"{eventSlug}-{shortGuid}";

        return Path.Combine(
            SanitizePath(storageCategory),
            eventFolder,
            now.Year.ToString(),
            now.Month.ToString("D2"),
            uniqueFileName);
    }

    private static async Task WriteFileAsync(string fullPath, Stream fileStream, CancellationToken cancellationToken)
    {
        await using var writer = new FileStream(
            fullPath,
            FileMode.Create,
            FileAccess.Write,
            FileShare.None,
            BufferSize,
            useAsync: true);

        await fileStream.CopyToAsync(writer, cancellationToken);
        await writer.FlushAsync(cancellationToken);
    }

    private bool IsPathSafe(string fullPath)
    {
        var normalizedFullPath = Path.GetFullPath(fullPath);
        var normalizedBasePath = Path.GetFullPath(_options.BasePath);
        return normalizedFullPath.StartsWith(normalizedBasePath, StringComparison.OrdinalIgnoreCase);
    }

    private static void EnsureDirectoryExists(string path)
    {
        if (!Directory.Exists(path))
            Directory.CreateDirectory(path);
    }

    private static string SanitizePath(string input)
    {
        return input
            .Replace("..", string.Empty)
            .Replace("/", string.Empty)
            .Replace("\\", string.Empty);
    }
}
