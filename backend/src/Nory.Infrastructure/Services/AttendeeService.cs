using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Attendees;
using Nory.Application.Services;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class AttendeeService : IAttendeeService
{
    private readonly IEventRepository _eventRepository;
    private readonly ILogger<AttendeeService> _logger;

    public AttendeeService(IEventRepository eventRepository, ILogger<AttendeeService> logger)
    {
        _eventRepository = eventRepository;
        _logger = logger;
    }

    public async Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _eventRepository.ExistsAsync(eventId, cancellationToken);
    }

    public Task<AttendeeStatusDto> GetAttendeeStatusAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting attendee status for event {EventId}", eventId);

        return Task.FromResult(new AttendeeStatusDto
        {
            IsRegistered = false,
            Name = null,
            Email = null,
            HasConsent = false,
        });
    }

    public Task<RegisterAttendeeResponseDto> RegisterAttendeeAsync(
        Guid eventId,
        RegisterAttendeeRequestDto request,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Registering attendee for event {EventId}: {Name}", eventId, request.Name);

        return Task.FromResult(new RegisterAttendeeResponseDto
        {
            Success = true,
            Message = "Registration acknowledged",
            AttendeeId = Guid.NewGuid().ToString(),
        });
    }

    public Task<UpdateConsentResponseDto> UpdateConsentAsync(
        Guid eventId,
        UpdateConsentRequestDto request,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating consent for event {EventId}", eventId);

        return Task.FromResult(new UpdateConsentResponseDto { Success = true, Message = "Consent updated" });
    }
}
