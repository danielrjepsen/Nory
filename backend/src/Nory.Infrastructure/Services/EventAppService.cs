using Nory.Application.DTOs.EventApps;
using Nory.Application.Services;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Services;

public class EventAppService : IEventAppService
{
    private readonly IEventRepository _eventRepository;
    private readonly IEventAppRepository _eventAppRepository;

    public EventAppService(
        IEventRepository eventRepository,
        IEventAppRepository eventAppRepository)
    {
        _eventRepository = eventRepository;
        _eventAppRepository = eventAppRepository;
    }

    public async Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _eventRepository.ExistsAsync(eventId, cancellationToken);
    }

    public async Task<IReadOnlyList<EventAppDto>> GetEventAppsAsync(
        Guid eventId,
        CancellationToken cancellationToken = default)
    {
        var eventApps = await _eventAppRepository.GetByEventIdAsync(eventId, cancellationToken);
        return [.. eventApps.Select(ea => ea.MapToDto())];
    }

    public async Task<EventAppDto?> GetEventAppAsync(
        Guid eventId,
        string appId,
        CancellationToken cancellationToken = default)
    {
        if (!Guid.TryParse(appId, out var appGuid))
            return null;

        var app = await _eventAppRepository.GetByIdAsync(appGuid, eventId, cancellationToken);
        return app?.MapToDto();
    }
}
