using Nory.Application.DTOs.Attendees;
using Nory.Application.DTOs.Events;

namespace Nory.Application.Services;

public interface IEventService
{
    // Queries
    Task<IReadOnlyList<EventDto>> GetEventsAsync(CancellationToken cancellationToken = default);
    Task<EventDto?> GetEventByIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<EventDto?> GetPublicEventAsync(Guid eventId, bool preview = false, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<EventAttendeeListDto> GetEventAttendeesAsync(Guid eventId, CancellationToken cancellationToken = default);

    // Commands
    Task<EventDto> CreateEventAsync(CreateEventDto dto, CancellationToken cancellationToken = default);
    Task<EventDto> UpdateEventAsync(Guid eventId, UpdateEventDto dto, CancellationToken cancellationToken = default);
    Task DeleteEventAsync(Guid eventId, CancellationToken cancellationToken = default);

    // Status transitions
    Task<EventDto> StartEventAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<EventDto> EndEventAsync(Guid eventId, CancellationToken cancellationToken = default);
}
