using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Attendees;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

/// <summary>
/// Handles attendee registration and session management.
/// Uses HTTP-only cookies for GDPR-compliant session tracking.
/// </summary>
[ApiController]
[Route("api/v1/attendees")]
[AllowAnonymous]
public class AttendeesController(
    IAttendeeService attendeeService,
    IWebHostEnvironment environment) : ControllerBase
{
    private const string AttendeeIdCookieName = "nory_attendee_id";
    private const int CookieExpirationDays = 365;

    [HttpGet("events/{eventId:guid}/status")]
    [ProducesResponseType(typeof(AttendeeStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAttendeeStatus(
        Guid eventId,
        CancellationToken cancellationToken
    )
    {
        var eventExists = await attendeeService.EventExistsAsync(eventId, cancellationToken);
        if (!eventExists)
        {
            return NotFound(new { message = "Event not found" });
        }

        var attendeeId = GetAttendeeIdFromCookie();
        var status = await attendeeService.GetAttendeeStatusAsync(eventId, attendeeId, cancellationToken);
        return Ok(status);
    }

    [HttpPost("events/{eventId:guid}")]
    [ProducesResponseType(typeof(RegisterAttendeeResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterAttendee(
        Guid eventId,
        [FromBody] RegisterAttendeeRequestDto request,
        CancellationToken cancellationToken
    )
    {
        var eventExists = await attendeeService.EventExistsAsync(eventId, cancellationToken);
        if (!eventExists)
        {
            return NotFound(new { message = "Event not found" });
        }

        var response = await attendeeService.RegisterAttendeeAsync(
            eventId,
            request,
            cancellationToken
        );

        if (response.Success && response.AttendeeId is not null)
        {
            SetAttendeeCookie(response.AttendeeId);
        }

        return Ok(response);
    }

    [HttpPatch("events/{eventId:guid}/consent")]
    [ProducesResponseType(typeof(UpdateConsentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateConsent(
        Guid eventId,
        [FromBody] UpdateConsentRequestDto request,
        CancellationToken cancellationToken
    )
    {
        var eventExists = await attendeeService.EventExistsAsync(eventId, cancellationToken);
        if (!eventExists)
        {
            return NotFound(new { message = "Event not found" });
        }

        var attendeeId = GetAttendeeIdFromCookie();
        if (!attendeeId.HasValue)
        {
            return Unauthorized(new { message = "Attendee session not found. Please register first." });
        }

        var response = await attendeeService.UpdateConsentAsync(
            eventId,
            attendeeId.Value,
            request,
            cancellationToken
        );

        return Ok(response);
    }

    /// <summary>
    /// GDPR Right to be Forgotten - Deletes/anonymizes attendee data
    /// </summary>
    [HttpDelete("events/{eventId:guid}/me")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteMyData(
        Guid eventId,
        CancellationToken cancellationToken
    )
    {
        var attendeeId = GetAttendeeIdFromCookie();
        if (!attendeeId.HasValue)
        {
            return Unauthorized(new { message = "Attendee session not found" });
        }

        var deleted = await attendeeService.DeleteAttendeeDataAsync(
            eventId,
            attendeeId.Value,
            cancellationToken
        );

        if (!deleted)
        {
            return NotFound(new { message = "Attendee not found" });
        }

        // Clear the cookie after data deletion
        ClearAttendeeCookie();

        return NoContent();
    }

    private Guid? GetAttendeeIdFromCookie()
    {
        if (Request.Cookies.TryGetValue(AttendeeIdCookieName, out var cookieValue) &&
            Guid.TryParse(cookieValue, out var attendeeId))
        {
            return attendeeId;
        }
        return null;
    }

    private void SetAttendeeCookie(string attendeeId)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = !environment.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(CookieExpirationDays),
            Path = "/",
        };

        Response.Cookies.Append(AttendeeIdCookieName, attendeeId, cookieOptions);
    }

    private void ClearAttendeeCookie()
    {
        Response.Cookies.Delete(AttendeeIdCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = !environment.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Path = "/",
        });
    }
}
