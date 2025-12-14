using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Attendees;
using Nory.Application.Services;
using Nory.Infrastructure.Persistence;

namespace Nory.Infrastructure.Services;

public class AttendeeService : IAttendeeService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AttendeeService> _logger;

    public AttendeeService(ApplicationDbContext context, ILogger<AttendeeService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> EventExistsAsync(
        Guid eventId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Events.AsNoTracking()
            .AnyAsync(e => e.Id == eventId, cancellationToken);
    }

    public Task<AttendeeStatusDto> GetAttendeeStatusAsync(
        Guid eventId,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogInformation("Getting attendee status for event {EventId}", eventId);

        // TODO: Implement attendee tracking with session/cookie based identification
        // For now return not registered status to allow the guest flow to work
        return Task.FromResult(
            new AttendeeStatusDto
            {
                IsRegistered = false,
                Name = null,
                Email = null,
                HasConsent = false,
            }
        );
    }

    public Task<RegisterAttendeeResponseDto> RegisterAttendeeAsync(
        Guid eventId,
        RegisterAttendeeRequestDto request,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogInformation(
            "Registering attendee for event {EventId}: {Name}",
            eventId,
            request.Name
        );

        // TODO: Implement actual attendee registration with:
        // - Session/cookie based identification
        // - Store attendee in database
        // - Associate with event
        // ..for now, acknowledge the registration
        return Task.FromResult(
            new RegisterAttendeeResponseDto
            {
                Success = true,
                Message = "Registration acknowledged",
                AttendeeId = Guid.NewGuid().ToString(),
            }
        );
    }

    public Task<UpdateConsentResponseDto> UpdateConsentAsync(
        Guid eventId,
        UpdateConsentRequestDto request,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogInformation("Updating consent for event {EventId}", eventId);

        // TODO: Implement actual consent
        return Task.FromResult(
            new UpdateConsentResponseDto { Success = true, Message = "Consent updated" }
        );
    }
}
