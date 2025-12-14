using Nory.Application.DTOs.Attendees;

namespace Nory.Application.Services;

public interface IAttendeeService
{
    /// <summary>
    /// check if event exists
    /// /// </summary>
    Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get attendee status for event
    /// </summary>
    Task<AttendeeStatusDto> GetAttendeeStatusAsync(
        Guid eventId,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Register attendee for an event
    /// </summary>
    Task<RegisterAttendeeResponseDto> RegisterAttendeeAsync(
        Guid eventId,
        RegisterAttendeeRequestDto request,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update attendee consent
    /// </summary>
    Task<UpdateConsentResponseDto> UpdateConsentAsync(
        Guid eventId,
        UpdateConsentRequestDto request,
        CancellationToken cancellationToken = default
    );
}
