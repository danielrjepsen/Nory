using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Attendees;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class AttendeeService : IAttendeeService
{
    private readonly IEventRepository _eventRepository;
    private readonly IAttendeeRepository _attendeeRepository;
    private readonly ILogger<AttendeeService> _logger;

    public AttendeeService(
        IEventRepository eventRepository,
        IAttendeeRepository attendeeRepository,
        ILogger<AttendeeService> logger)
    {
        _eventRepository = eventRepository;
        _attendeeRepository = attendeeRepository;
        _logger = logger;
    }

    public async Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _eventRepository.ExistsAsync(eventId, cancellationToken);
    }

    public async Task<AttendeeStatusDto> GetAttendeeStatusAsync(
        Guid eventId,
        Guid? attendeeId,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting attendee status for event {EventId}, attendee {AttendeeId}", eventId, attendeeId);

        if (!attendeeId.HasValue)
        {
            return new AttendeeStatusDto
            {
                IsRegistered = false,
                Name = null,
                Email = null,
                HasPhotoRevealConsent = false,
            };
        }

        var attendee = await _attendeeRepository.GetByEventAndIdAsync(eventId, attendeeId.Value, cancellationToken);
        if (attendee is null || attendee.IsDeleted)
        {
            return new AttendeeStatusDto
            {
                IsRegistered = false,
                Name = null,
                Email = null,
                HasPhotoRevealConsent = false,
            };
        }

        return new AttendeeStatusDto
        {
            IsRegistered = true,
            Name = attendee.Name,
            Email = attendee.Email,
            HasPhotoRevealConsent = attendee.HasPhotoRevealConsent,
        };
    }

    public async Task<RegisterAttendeeResponseDto> RegisterAttendeeAsync(
        Guid eventId,
        RegisterAttendeeRequestDto request,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Registering attendee for event {EventId}: {Name}", eventId, request.Name);

        try
        {
            var attendee = Attendee.Create(
                eventId: eventId,
                name: request.Name,
                email: request.Email,
                wantsPhotoReveal: request.WantsPhotoReveal
            );

            _attendeeRepository.Add(attendee);
            await _attendeeRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attendee {AttendeeId} registered for event {EventId}", attendee.Id, eventId);

            return new RegisterAttendeeResponseDto
            {
                Success = true,
                Message = "Registration successful",
                AttendeeId = attendee.Id.ToString(),
            };
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid attendee registration data for event {EventId}", eventId);
            return new RegisterAttendeeResponseDto
            {
                Success = false,
                Message = ex.Message,
                AttendeeId = null,
            };
        }
    }

    public async Task<UpdateConsentResponseDto> UpdateConsentAsync(
        Guid eventId,
        Guid attendeeId,
        UpdateConsentRequestDto request,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating consent for attendee {AttendeeId} in event {EventId}", attendeeId, eventId);

        var attendee = await _attendeeRepository.GetByEventAndIdAsync(eventId, attendeeId, cancellationToken);
        if (attendee is null || attendee.IsDeleted)
        {
            return new UpdateConsentResponseDto
            {
                Success = false,
                Message = "Attendee not found"
            };
        }

        try
        {
            attendee.UpdateConsent(
                wantsPhotoReveal: request.WantsPhotoReveal ?? attendee.HasPhotoRevealConsent,
                email: request.Email
            );

            _attendeeRepository.Update(attendee);
            await _attendeeRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Consent updated for attendee {AttendeeId}", attendeeId);

            return new UpdateConsentResponseDto
            {
                Success = true,
                Message = "Consent updated successfully"
            };
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid consent update data for attendee {AttendeeId}", attendeeId);
            return new UpdateConsentResponseDto
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    public async Task<bool> DeleteAttendeeDataAsync(
        Guid eventId,
        Guid attendeeId,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting attendee data for {AttendeeId} in event {EventId} (GDPR request)", attendeeId, eventId);

        var attendee = await _attendeeRepository.GetByEventAndIdAsync(eventId, attendeeId, cancellationToken);
        if (attendee is null)
        {
            return false;
        }

        // Anonymize rather than hard delete to preserve aggregate metrics
        attendee.Anonymize();
        _attendeeRepository.Update(attendee);
        await _attendeeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Attendee data anonymized for {AttendeeId} (GDPR compliance)", attendeeId);
        return true;
    }
}
