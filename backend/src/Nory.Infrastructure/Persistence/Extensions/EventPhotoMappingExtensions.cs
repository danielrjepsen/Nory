using Nory.Core.Domain.Entities;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class EventPhotoMappingExtensions
{
    public static EventPhoto MapToDomain(this EventPhotoDbModel dbModel)
    {
        return new EventPhoto(
            id: dbModel.Id,
            eventId: dbModel.EventId,
            fileName: dbModel.FileName,
            originalFileName: dbModel.OriginalFileName,
            contentType: dbModel.ContentType,
            fileSizeBytes: dbModel.FileSizeBytes,
            storagePath: dbModel.StoragePath,
            imageUrl: dbModel.ImageUrl,
            uploadedBy: dbModel.UploadedBy,
            year: dbModel.Year,
            width: dbModel.Width,
            height: dbModel.Height,
            exifData: dbModel.ExifData,
            createdAt: dbModel.CreatedAt,
            categoryId: dbModel.CategoryId
        );
    }

    public static EventPhotoDbModel MapToDbModel(this EventPhoto domainPhoto)
    {
        return new EventPhotoDbModel
        {
            Id = domainPhoto.Id,
            EventId = domainPhoto.EventId,
            CategoryId = domainPhoto.CategoryId,
            FileName = domainPhoto.FileName,
            OriginalFileName = domainPhoto.OriginalFileName,
            ContentType = domainPhoto.ContentType,
            FileSizeBytes = domainPhoto.FileSizeBytes,
            StoragePath = domainPhoto.StoragePath,
            ImageUrl = domainPhoto.ImageUrl,
            UploadedBy = domainPhoto.UploadedBy,
            Year = domainPhoto.Year,
            Width = domainPhoto.Width,
            Height = domainPhoto.Height,
            ExifData = domainPhoto.ExifData,
            CreatedAt = domainPhoto.CreatedAt
        };
    }

    public static void UpdateFrom(this EventPhotoDbModel dbModel, EventPhoto domainPhoto)
    {
        dbModel.CategoryId = domainPhoto.CategoryId;
        dbModel.FileName = domainPhoto.FileName;
        dbModel.OriginalFileName = domainPhoto.OriginalFileName;
        dbModel.ContentType = domainPhoto.ContentType;
        dbModel.FileSizeBytes = domainPhoto.FileSizeBytes;
        dbModel.StoragePath = domainPhoto.StoragePath;
        dbModel.ImageUrl = domainPhoto.ImageUrl;
        dbModel.UploadedBy = domainPhoto.UploadedBy;
        dbModel.Year = domainPhoto.Year;
        dbModel.Width = domainPhoto.Width;
        dbModel.Height = domainPhoto.Height;
        dbModel.ExifData = domainPhoto.ExifData;
    }

    public static IReadOnlyList<EventPhoto> MapToDomain(this IEnumerable<EventPhotoDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }
}
