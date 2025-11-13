
using FluentValidation;
using Nory.Application.DTOs.Events;
using Nory.Application.Extensions;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;

namespace Nory.Application.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly IValidator<CreateEventDto> _createValidator;
    private readonly IValidator<UpdateEventDto> _updateValidator;
    private readonly ILogger<EventService> _logger;

    public EventService(
        IEventRepository eventRepository,
        IValidator<CreateEventDto> createValidator,
        IValidator<UpdateEventDto> updateValidator,
        ILogger<EventService> logger)
    {
        _eventRepository = eventRepository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    public async Task<List<EventDto>> GetEventsAsync()
    {
        var events = await _eventRepository.GetEventsAsync();
        return events.Select(e => e.MapToDto()).ToList();
    }

    public async Task<EventDto?> GetEventByIdAsync(Guid id)
    {
        var eventEntity = await _eventRepository.GetEventByIdAsync(id);
        return eventEntity?.MapToDto();
    }

    public async Task<EventDto> CreateEventAsync(CreateEventDto createDto)
    {
        await _createValidator.ValidateAndThrowAsync(createDto);

        var eventEntity = new Event(
            createDto.Name,
            createDto.StartsAt,
            createDto.EndsAt
        );

        if (!string.IsNullOrWhiteSpace(createDto.Description))
        {
            eventEntity.UpdateDetails(createDto.Name, createDto.Description);
        }

        var createdEvent = await _eventRepository.AddAsync(eventEntity);
        await _eventRepository.SaveChangesAsync();

        _logger.LogInformation("Created event {EventId}", createdEvent.Id);

        return createdEvent.MapToDto();
    }

    public async Task<EventDto> UpdateEventAsync(Guid id, UpdateEventDto updateDto)
    {
        await _updateValidator.ValidateAndThrowAsync(updateDto);

        var eventEntity = await _eventRepository.GetEventByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event {id} not found");

        eventEntity.UpdateDetails(updateDto.Name, updateDto.Description);

        await _eventRepository.UpdateAsync(eventEntity);
        await _eventRepository.SaveChangesAsync();

        _logger.LogInformation("Updated event {EventId}", id);

        return eventEntity.MapToDto();
    }

    public async Task DeleteEventAsync(Guid id)
    {
        if (!await _eventRepository.ExistsAsync(id))
            throw new KeyNotFoundException($"Event {id} not found");

        await _eventRepository.DeleteAsync(id);
        await _eventRepository.SaveChangesAsync();

        _logger.LogInformation("Deleted event {EventId}", id);
    }

    public async Task StartEventAsync(Guid id)
    {
        var eventEntity = await _eventRepository.GetEventByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event {id} not found");

        eventEntity.Start();

        await _eventRepository.UpdateAsync(eventEntity);
        await _eventRepository.SaveChangesAsync();

        _logger.LogInformation("Started event {EventId}", id);
    }

    public async Task EndEventAsync(Guid id)
    {
        var eventEntity = await _eventRepository.GetEventByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event {id} not found");

        eventEntity.End();

        await _eventRepository.UpdateAsync(eventEntity);
        await _eventRepository.SaveChangesAsync();

        _logger.LogInformation("Ended event {EventId}", id);
    }
}