using Nory.Application.DTOs.Attendees;

namespace Nory.Application.Services;

public interface IAttendeeService
{
    /// <summary>
    /// Check if event exists
    /// </summary>
    Task<bool> EventExistsAsync(Guid eventId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get attendee status for event using the attendee's session ID from cookie
    /// </summary>
    Task<AttendeeStatusDto> GetAttendeeStatusAsync(
        Guid eventId,
        Guid? attendeeId,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Register attendee for an event. Returns the new attendee ID for cookie storage.
    /// </summary>
    Task<RegisterAttendeeResponseDto> RegisterAttendeeAsync(
        Guid eventId,
        RegisterAttendeeRequestDto request,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update attendee consent using the attendee's session ID from cookie
    /// </summary>
    Task<UpdateConsentResponseDto> UpdateConsentAsync(
        Guid eventId,
        Guid attendeeId,
        UpdateConsentRequestDto request,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Delete attendee data (GDPR right to be forgotten).
    /// Anonymizes personal data while preserving aggregate metrics.
    /// </summary>
    Task<bool> DeleteAttendeeDataAsync(
        Guid eventId,
        Guid attendeeId,
        CancellationToken cancellationToken = default
    );
}
