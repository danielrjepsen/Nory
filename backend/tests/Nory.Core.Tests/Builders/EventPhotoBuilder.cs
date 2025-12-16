using Nory.Core.Domain.Entities;

namespace Nory.Core.Tests.Builders;

public class EventPhotoBuilder
{
    private Guid _id = Guid.NewGuid();
    private Guid _eventId = Guid.NewGuid();
    private Guid? _categoryId = null;
    private string _fileName = "photo.jpg";
    private string _originalFileName = "original_photo.jpg";
    private string _contentType = "image/jpeg";
    private long _fileSizeBytes = 1024 * 100; // 100KB
    private string _storagePath = "events/test/2024/01/photo.jpg";
    private string _imageUrl = "/api/v1/events/{eventId}/photos/{id}/image";
    private string? _uploadedBy = "Test User";
    private int? _year = DateTime.UtcNow.Year;
    private int? _width = 1920;
    private int? _height = 1080;
    private string? _exifData = null;
    private DateTime _createdAt = DateTime.UtcNow;

    public EventPhotoBuilder WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public EventPhotoBuilder ForEvent(Guid eventId)
    {
        _eventId = eventId;
        return this;
    }

    public EventPhotoBuilder InCategory(Guid categoryId)
    {
        _categoryId = categoryId;
        return this;
    }

    public EventPhotoBuilder WithFileName(string fileName)
    {
        _fileName = fileName;
        return this;
    }

    public EventPhotoBuilder WithOriginalFileName(string originalFileName)
    {
        _originalFileName = originalFileName;
        return this;
    }

    public EventPhotoBuilder WithContentType(string contentType)
    {
        _contentType = contentType;
        return this;
    }

    public EventPhotoBuilder WithSize(long bytes)
    {
        _fileSizeBytes = bytes;
        return this;
    }

    public EventPhotoBuilder WithStoragePath(string path)
    {
        _storagePath = path;
        return this;
    }

    public EventPhotoBuilder UploadedBy(string? userName)
    {
        _uploadedBy = userName;
        return this;
    }

    public EventPhotoBuilder WithDimensions(int width, int height)
    {
        _width = width;
        _height = height;
        return this;
    }

    public EventPhotoBuilder CreatedAt(DateTime createdAt)
    {
        _createdAt = createdAt;
        return this;
    }

    public EventPhoto Build()
    {
        var imageUrl = $"/api/v1/events/{_eventId}/photos/{_id}/image";

        return new EventPhoto(
            id: _id,
            eventId: _eventId,
            fileName: _fileName,
            originalFileName: _originalFileName,
            contentType: _contentType,
            fileSizeBytes: _fileSizeBytes,
            storagePath: _storagePath,
            imageUrl: imageUrl,
            uploadedBy: _uploadedBy,
            year: _year,
            width: _width,
            height: _height,
            exifData: _exifData,
            createdAt: _createdAt,
            categoryId: _categoryId
        );
    }

    public EventPhoto Create()
    {
        return EventPhoto.Create(
            eventId: _eventId,
            fileName: _fileName,
            originalFileName: _originalFileName,
            contentType: _contentType,
            fileSizeBytes: _fileSizeBytes,
            storagePath: _storagePath,
            uploadedBy: _uploadedBy,
            categoryId: _categoryId,
            width: _width,
            height: _height
        );
    }

    public static EventPhotoBuilder Default() => new();

    public static EventPhotoBuilder ForEvent(Event @event) =>
        new EventPhotoBuilder().ForEvent(@event.Id);
}
