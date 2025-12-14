using Nory.Application.DTOs.EventApps;

namespace Nory.Application.Services;

public interface IEventAppService
{
    Task<IReadOnlyList<EventAppDto>> GetEventAppsAsync(
        Guid eventId,
        CancellationToken cancellationToken = default
    );

    Task<EventAppDto?> GetEventAppAsync(
        Guid eventId,
        string appId,
        CancellationToken cancellationToken = default
    );

    Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default);
}
