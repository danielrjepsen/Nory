namespace Nory.Core.Domain.Entities;

public class EventPhoto
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public Guid? CategoryId { get; private set; }
    public string FileName { get; private set; }
    public string OriginalFileName { get; private set; }
    public string ContentType { get; private set; }
    public long FileSizeBytes { get; private set; }
    public string StoragePath { get; private set; }
    public string ImageUrl { get; private set; }
    public string? UploadedBy { get; private set; }
    public int? Year { get; private set; }
    public int? Width { get; private set; }
    public int? Height { get; private set; }
    public string? ExifData { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public EventPhoto(
        Guid id,
        Guid eventId,
        string fileName,
        string originalFileName,
        string contentType,
        long fileSizeBytes,
        string storagePath,
        string imageUrl,
        string? uploadedBy,
        int? year,
        int? width,
        int? height,
        string? exifData,
        DateTime createdAt,
        Guid? categoryId = null)
    {
        Id = id;
        EventId = eventId;
        FileName = fileName;
        OriginalFileName = originalFileName;
        ContentType = contentType;
        FileSizeBytes = fileSizeBytes;
        StoragePath = storagePath;
        ImageUrl = imageUrl;
        UploadedBy = uploadedBy;
        Year = year;
        Width = width;
        Height = height;
        ExifData = exifData;
        CreatedAt = createdAt;
        CategoryId = categoryId;
    }

    public static EventPhoto Create(
        Guid eventId,
        string fileName,
        string originalFileName,
        string contentType,
        long fileSizeBytes,
        string storagePath,
        string? uploadedBy = null,
        Guid? categoryId = null,
        int? width = null,
        int? height = null)
    {
        var id = Guid.NewGuid();
        var imageUrl = $"/api/v1/events/{eventId}/photos/{id}/image";

        return new EventPhoto(
            id: id,
            eventId: eventId,
            fileName: fileName,
            originalFileName: originalFileName,
            contentType: contentType,
            fileSizeBytes: fileSizeBytes,
            storagePath: storagePath,
            imageUrl: imageUrl,
            uploadedBy: uploadedBy ?? "Anonymous",
            year: DateTime.UtcNow.Year,
            width: width,
            height: height,
            exifData: null,
            createdAt: DateTime.UtcNow,
            categoryId: categoryId
        );
    }

    public void MoveToCategory(Guid? categoryId)
    {
        CategoryId = categoryId;
    }
}
