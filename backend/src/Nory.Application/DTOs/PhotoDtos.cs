namespace Nory.Application.DTOs;

public record PhotoDto(
    Guid Id,
    string ImageUrl,
    string OriginalFileName,
    string UploadedBy,
    Guid? CategoryId,
    int? Width,
    int? Height,
    long FileSizeBytes,
    DateTime CreatedAt
);

public record PhotosResponse(
    bool Success,
    IReadOnlyList<PhotoDto> Photos,
    int TotalCount
);

public record UploadedPhotoDto(Guid PhotoId, string FileName, string ImageUrl);

public record UploadPhotosResponse(
    bool Success,
    string Message,
    IReadOnlyList<UploadedPhotoDto> UploadedPhotos,
    string UploadedBy
);

public record UploadPhotoCommand(
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSize,
    string? UserName,
    Guid? CategoryId
);

public record MovePhotoCategoryCommand(Guid? CategoryId);
