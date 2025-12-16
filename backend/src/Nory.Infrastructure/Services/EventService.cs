using FluentValidation;
using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Events;
using Nory.Application.Extensions;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

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

    public async Task<IReadOnlyList<EventDto>> GetEventsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var events = await _eventRepository.GetByUserIdAsync(userId, cancellationToken);
        return events.MapToDto();
    }

    public async Task<EventDto?> GetEventByIdAsync(Guid eventId, string userId, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdWithPhotosAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return null;

        if (!eventEntity.BelongsTo(userId))
        {
            _logger.LogWarning("User {UserId} attempted to access event {EventId} they don't own", userId, eventId);
            return null;
        }

        return eventEntity.MapToDto();
    }

    public async Task<EventDto?> GetPublicEventAsync(Guid eventId, bool preview = false, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return null;

        if (!eventEntity.IsPublic)
            return null;

        if (eventEntity.Status == EventStatus.Archived)
            return null;

        if (eventEntity.Status == EventStatus.Draft && !preview)
            return null;

        return eventEntity.MapToDto();
    }

    public async Task<bool> ExistsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _eventRepository.ExistsAsync(eventId, cancellationToken);
    }

    public async Task<EventDto> CreateEventAsync(CreateEventDto dto, string userId, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var eventEntity = Event.Create(
            userId: userId,
            name: dto.Name,
            description: dto.Description,
            location: dto.Location,
            startsAt: dto.StartsAt,
            endsAt: dto.EndsAt,
            isPublic: dto.IsPublic,
            themeName: dto.ThemeName,
            guestAppConfig: dto.GuestAppConfig
        );

        _eventRepository.Add(eventEntity);
        await _eventRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} created event {EventId}", userId, eventEntity.Id);

        return eventEntity.MapToDto();
    }

    public async Task<EventDto> UpdateEventAsync(Guid eventId, UpdateEventDto dto, string userId, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Event {eventId} not found");

        if (!eventEntity.BelongsTo(userId))
            throw new UnauthorizedAccessException("Access denied");

        if (!string.IsNullOrEmpty(dto.Status) && Enum.TryParse<EventStatus>(dto.Status, true, out var newStatus))
        {
            switch (newStatus)
            {
                case EventStatus.Live when eventEntity.Status == EventStatus.Draft:
                    eventEntity.Start();
                    break;
                case EventStatus.Ended when eventEntity.Status == EventStatus.Live:
                    eventEntity.End();
                    break;
                case EventStatus.Archived:
                    eventEntity.Archive();
                    break;
            }
        }

        eventEntity.UpdateDetails(
            name: dto.Name,
            description: dto.Description,
            location: dto.Location,
            startsAt: dto.StartsAt,
            endsAt: dto.EndsAt,
            isPublic: dto.IsPublic,
            guestAppConfig: dto.GuestAppConfig,
            themeName: dto.ThemeName
        );

        _eventRepository.Update(eventEntity);
        await _eventRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} updated event {EventId}", userId, eventId);

        return eventEntity.MapToDto();
    }

    public async Task DeleteEventAsync(Guid eventId, string userId, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Event {eventId} not found");

        if (!eventEntity.BelongsTo(userId))
            throw new UnauthorizedAccessException("Access denied");

        eventEntity.Archive();

        _eventRepository.Update(eventEntity);
        await _eventRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} deleted (archived) event {EventId}", userId, eventId);
    }

    public async Task<EventDto> StartEventAsync(Guid eventId, string userId, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Event {eventId} not found");

        if (!eventEntity.BelongsTo(userId))
            throw new UnauthorizedAccessException("Access denied");

        eventEntity.Start();

        _eventRepository.Update(eventEntity);
        await _eventRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} started event {EventId}", userId, eventId);

        return eventEntity.MapToDto();
    }

    public async Task<EventDto> EndEventAsync(Guid eventId, string userId, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Event {eventId} not found");

        if (!eventEntity.BelongsTo(userId))
            throw new UnauthorizedAccessException("Access denied");

        eventEntity.End();

        _eventRepository.Update(eventEntity);
        await _eventRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} ended event {EventId}", userId, eventId);

        return eventEntity.MapToDto();
    }
}
