using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Nory.Application.Services;

namespace Nory.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _basePath;
    private readonly ILogger<LocalFileStorageService> _logger;

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/heic",
        "image/heif",
        "video/mp4",
        "video/quicktime",
        "video/webm"
    };

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif",
        ".mp4", ".mov", ".webm"
    };

    private const long MaxImageSizeBytes = 50 * 1024 * 1024;       // 50MB
    private const long MaxVideoSizeBytes = 1024 * 1024 * 1024;    // 1GB

    public LocalFileStorageService(
        IOptions<FileStorageOptions> options,
        ILogger<LocalFileStorageService> logger)
    {
        _basePath = options.Value.BasePath;
        _logger = logger;

        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
            _logger.LogInformation("Created file storage directory: {BasePath}", _basePath);
        }
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
            if (!AllowedContentTypes.Contains(contentType))
            {
                _logger.LogWarning("Invalid content type: {ContentType}", contentType);
                return new FileStorageResult(false, string.Empty, "Invalid file type");
            }

            var extension = Path.GetExtension(fileName);
            if (!AllowedExtensions.Contains(extension))
            {
                _logger.LogWarning("Invalid file extension: {Extension}", extension);
                return new FileStorageResult(false, string.Empty, "Invalid file extension");
            }

            var isVideo = contentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase);
            var maxSize = isVideo ? MaxVideoSizeBytes : MaxImageSizeBytes;
            var maxSizeLabel = isVideo ? "1GB" : "50MB";

            if (fileStream.Length > maxSize)
            {
                _logger.LogWarning("File too large: {Size} bytes (max {MaxSize})",
                    fileStream.Length, maxSizeLabel);
                return new FileStorageResult(false, string.Empty, $"File too large (max {maxSizeLabel})");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension.ToLowerInvariant()}";
            var year = DateTime.UtcNow.Year;
            var month = DateTime.UtcNow.Month.ToString("D2");

            // events/johns-wedding-aaacb193/2025/12/abc123.jpg
            var eventSlug = CreateSlug(eventName);
            var shortGuid = eventId.ToString()[..8];
            var eventFolder = $"{eventSlug}-{shortGuid}";

            var relativePath = Path.Combine(
                SanitizePath(storageCategory),
                eventFolder,
                year.ToString(),
                month,
                uniqueFileName
            );

            var fullPath = Path.Combine(_basePath, relativePath);
            var directory = Path.GetDirectoryName(fullPath)!;

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            await using var fileStreamWriter = new FileStream(
                fullPath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None,
                bufferSize: 81920,
                useAsync: true
            );

            await fileStream.CopyToAsync(fileStreamWriter, cancellationToken);
            await fileStreamWriter.FlushAsync(cancellationToken);

            _logger.LogInformation("Stored file: {FileName} -> {StoragePath} ({Size} bytes)",
                fileName, relativePath, fileStream.Length);

            return new FileStorageResult(true, relativePath);
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
        try
        {
            var fullPath = Path.Combine(_basePath, storagePath);

            if (!IsPathSafe(fullPath))
            {
                _logger.LogWarning("Path traversal attempt: {Path}", storagePath);
                return Task.FromResult<FileRetrievalResult?>(null);
            }

            if (!File.Exists(fullPath))
            {
                _logger.LogDebug("File not found: {Path}", storagePath);
                return Task.FromResult<FileRetrievalResult?>(null);
            }

            var fileInfo = new FileInfo(fullPath);
            var contentType = GetContentType(fileInfo.Extension);
            var stream = new FileStream(
                fullPath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                bufferSize: 81920,
                useAsync: true
            );

            return Task.FromResult<FileRetrievalResult?>(new FileRetrievalResult(
                stream,
                contentType,
                fileInfo.Name,
                fileInfo.Length
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve file: {Path}", storagePath);
            return Task.FromResult<FileRetrievalResult?>(null);
        }
    }

    public Task<bool> DeleteFileAsync(
        string storagePath,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var fullPath = Path.Combine(_basePath, storagePath);

            if (!IsPathSafe(fullPath))
            {
                _logger.LogWarning("Path traversal attempt on delete: {Path}", storagePath);
                return Task.FromResult(false);
            }

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                _logger.LogInformation("Deleted file: {Path}", storagePath);
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {Path}", storagePath);
            return Task.FromResult(false);
        }
    }

    public Task<bool> FileExistsAsync(
        string storagePath,
        CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_basePath, storagePath);
        return Task.FromResult(IsPathSafe(fullPath) && File.Exists(fullPath));
    }

    private bool IsPathSafe(string fullPath)
    {
        var normalizedFullPath = Path.GetFullPath(fullPath);
        var normalizedBasePath = Path.GetFullPath(_basePath);
        return normalizedFullPath.StartsWith(normalizedBasePath, StringComparison.OrdinalIgnoreCase);
    }

    private static string SanitizePath(string input)
    {
        return input
            .Replace("..", string.Empty)
            .Replace("/", string.Empty)
            .Replace("\\", string.Empty);
    }

    private static string CreateSlug(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "unnamed";

        var slug = input.ToLowerInvariant().Trim();

        slug = slug
            .Replace("'", "")
            .Replace("\"", "")
            .Replace("&", "and");

        var result = new System.Text.StringBuilder();
        foreach (var c in slug)
        {
            if (char.IsLetterOrDigit(c))
                result.Append(c);
            else if (c == ' ' || c == '-' || c == '_')
                result.Append('-');
        }

        slug = result.ToString();
        while (slug.Contains("--"))
            slug = slug.Replace("--", "-");

        slug = slug.Trim('-');

        if (slug.Length > 50)
            slug = slug[..50].TrimEnd('-');

        return string.IsNullOrEmpty(slug) ? "unnamed" : slug;
    }

    private static string GetContentType(string extension)
    {
        return extension.ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".heic" => "image/heic",
            ".heif" => "image/heif",
            ".mp4" => "video/mp4",
            ".mov" => "video/quicktime",
            ".webm" => "video/webm",
            _ => "application/octet-stream"
        };
    }
}

public class FileStorageOptions
{
    public const string SectionName = "FileStorage";
    public string BasePath { get; set; } = "uploads";
}
