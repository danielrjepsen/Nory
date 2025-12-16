namespace Nory.Infrastructure.Utilities;

public static class ContentTypeMapper
{
    private static readonly Dictionary<string, string> ExtensionToContentType = new(StringComparer.OrdinalIgnoreCase)
    {
        [".jpg"] = "image/jpeg",
        [".jpeg"] = "image/jpeg",
        [".png"] = "image/png",
        [".gif"] = "image/gif",
        [".webp"] = "image/webp",
        [".heic"] = "image/heic",
        [".heif"] = "image/heif",
        [".mp4"] = "video/mp4",
        [".mov"] = "video/quicktime",
        [".webm"] = "video/webm"
    };

    public static string GetContentType(string extension)
    {
        return ExtensionToContentType.TryGetValue(extension, out var contentType)
            ? contentType
            : "application/octet-stream";
    }

    public static bool IsVideo(string contentType)
    {
        return contentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase);
    }
}
