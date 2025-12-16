using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Nory.Application.Services;

namespace Nory.Infrastructure.Services;

public partial class LocalFileStorageService : IFileStorageService
{
    private const int BufferSize = 81920;
    private const int MaxSlugLength = 50;
    private const int ShortGuidLength = 8;

    private readonly string _basePath;
    private readonly FileStorageOptions _options;
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
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".heic",
        ".heif",
        ".mp4",
        ".mov",
        ".webm"
    };

    public LocalFileStorageService(
        IOptions<FileStorageOptions> options,
        ILogger<LocalFileStorageService> logger)
    {
        _options = options.Value;
        _basePath = _options.BasePath;
        _logger = logger;

        EnsureDirectoryExists(_basePath);
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
            var maxSize = isVideo ? _options.MaxVideoSizeBytes : _options.MaxImageSizeBytes;
            var maxSizeLabel = isVideo ? "1GB" : "50MB";

            if (fileStream.Length > maxSize)
            {
                _logger.LogWarning("File too large: {Size} bytes (max {MaxSize})", fileStream.Length, maxSizeLabel);
                return new FileStorageResult(false, string.Empty, $"File too large (max {maxSizeLabel})");
            }

            var now = DateTime.UtcNow;
            var uniqueFileName = $"{Guid.NewGuid()}{extension.ToLowerInvariant()}";
            var eventSlug = CreateSlug(eventName);
            var shortGuid = eventId.ToString()[..ShortGuidLength];
            var eventFolder = $"{eventSlug}-{shortGuid}";

            var relativePath = Path.Combine(
                SanitizePath(storageCategory),
                eventFolder,
                now.Year.ToString(),
                now.Month.ToString("D2"),
                uniqueFileName);

            var fullPath = Path.Combine(_basePath, relativePath);
            EnsureDirectoryExists(Path.GetDirectoryName(fullPath)!);

            await using var fileStreamWriter = new FileStream(
                fullPath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None,
                BufferSize,
                useAsync: true);

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
        var fullPath = Path.Combine(_basePath, storagePath);

        if (!IsPathSafe(fullPath))
        {
            _logger.LogWarning("Path traversal attempt: {Path}", storagePath);
            return Task.FromResult<FileRetrievalResult?>(null);
        }

        if (!File.Exists(fullPath))
            return Task.FromResult<FileRetrievalResult?>(null);

        var fileInfo = new FileInfo(fullPath);
        var contentType = GetContentType(fileInfo.Extension);
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
        var fullPath = Path.Combine(_basePath, storagePath);

        if (!IsPathSafe(fullPath))
        {
            _logger.LogWarning("Path traversal attempt on delete: {Path}", storagePath);
            return Task.FromResult(false);
        }

        if (!File.Exists(fullPath))
            return Task.FromResult(false);

        File.Delete(fullPath);
        _logger.LogInformation("Deleted file: {Path}", storagePath);
        return Task.FromResult(true);
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

    private static string CreateSlug(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "unnamed";

        var slug = input.ToLowerInvariant().Trim();
        slug = slug.Replace("'", "").Replace("\"", "").Replace("&", "and");

        var result = new StringBuilder();
        foreach (var c in slug)
        {
            if (char.IsLetterOrDigit(c))
                result.Append(c);
            else if (c is ' ' or '-' or '_')
                result.Append('-');
        }

        slug = MultiDashRegex().Replace(result.ToString(), "-").Trim('-');

        if (slug.Length > MaxSlugLength)
            slug = slug[..MaxSlugLength].TrimEnd('-');

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

    [GeneratedRegex("--+")]
    private static partial Regex MultiDashRegex();
}
