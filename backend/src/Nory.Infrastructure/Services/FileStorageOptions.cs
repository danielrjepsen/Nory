namespace Nory.Infrastructure.Services;

public class FileStorageOptions
{
    public const string SectionName = "FileStorage";

    public string BasePath { get; set; } = "uploads";
    public long MaxImageSizeBytes { get; set; } = 50 * 1024 * 1024; // 50MB
    public long MaxVideoSizeBytes { get; set; } = 1024 * 1024 * 1024; // 1GB

    public string[] AllowedImageContentTypes { get; set; } =
    [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/heic",
        "image/heif"
    ];

    public string[] AllowedVideoContentTypes { get; set; } =
    [
        "video/mp4",
        "video/quicktime",
        "video/webm"
    ];

    public string[] AllowedExtensions { get; set; } =
    [
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
    ];

    public string MaxImageSizeLabel => FormatSize(MaxImageSizeBytes);
    public string MaxVideoSizeLabel => FormatSize(MaxVideoSizeBytes);

    private static string FormatSize(long bytes)
    {
        return bytes switch
        {
            >= 1024 * 1024 * 1024 => $"{bytes / (1024 * 1024 * 1024)}GB",
            >= 1024 * 1024 => $"{bytes / (1024 * 1024)}MB",
            >= 1024 => $"{bytes / 1024}KB",
            _ => $"{bytes}B"
        };
    }
}
