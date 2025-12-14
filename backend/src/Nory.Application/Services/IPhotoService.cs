using Nory.Application.Common;
using Nory.Application.DTOs;

namespace Nory.Application.Services;

public interface IPhotoService
{
    Task<Result<PhotosResponse>> GetPhotosForDashboardAsync(
        Guid eventId,
        string userId,
        Guid? categoryId = null,
        int limit = 50,
        int offset = 0,
        CancellationToken cancellationToken = default);

    Task<Result<UploadPhotosResponse>> UploadPhotosAsync(
        Guid eventId,
        IReadOnlyList<UploadPhotoCommand> files,
        CancellationToken cancellationToken = default);

    Task<Result> MovePhotoToCategoryAsync(
        Guid eventId,
        Guid photoId,
        string userId,
        MovePhotoCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<Result> DeletePhotoAsync(
        Guid eventId,
        Guid photoId,
        string userId,
        CancellationToken cancellationToken = default);

    Task<Result<FileResult>> GetPhotoImageAsync(
        Guid eventId,
        Guid photoId,
        string userId,
        CancellationToken cancellationToken = default);
}
