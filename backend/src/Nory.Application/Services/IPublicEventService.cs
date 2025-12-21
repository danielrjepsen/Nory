using Nory.Application.Common;
using Nory.Application.DTOs;

namespace Nory.Application.Services;

public interface IPublicEventService
{
    Task<Result<PublicEventsResponse>> GetPublicEventsAsync(
        CancellationToken cancellationToken = default);

    Task<Result<PublicPhotosResponse>> GetPhotosAsync(
        Guid eventId,
        GetPhotosQuery query,
        CancellationToken cancellationToken = default);

    Task<Result<FileResult>> GetPhotoImageAsync(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken = default);

    Task<Result<PublicCategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        CancellationToken cancellationToken = default);

    Task<Result<TemplateResponse>> GetTemplateAsync(
        Guid eventId,
        CancellationToken cancellationToken = default);
}
