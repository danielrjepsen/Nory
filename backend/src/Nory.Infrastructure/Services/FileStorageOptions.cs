namespace Nory.Infrastructure.Services;

public class FileStorageOptions
{
    public const string SectionName = "FileStorage";
    public string BasePath { get; set; } = "uploads";
    public long MaxImageSizeBytes { get; set; } = 50 * 1024 * 1024; // 50MB
    public long MaxVideoSizeBytes { get; set; } = 1024 * 1024 * 1024; // 1GB
}
