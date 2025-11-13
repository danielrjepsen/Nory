using Nory.Application.DTOs.Events;

namespace Nory.Application.Services;

public interface IEventService
{
    Task<List<EventDto>> GetEventsAsync();
    Task<EventDto?> GetEventByIdAsync(Guid id);
    Task<EventDto> CreateEventAsync(CreateEventDto createDto);
    Task<EventDto> UpdateEventAsync(Guid id, UpdateEventDto updateDto);
    Task DeleteEventAsync(Guid id);
    Task StartEventAsync(Guid id);
    Task EndEventAsync(Guid id);
}
