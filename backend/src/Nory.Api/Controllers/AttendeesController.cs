using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Attendees;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[ApiController]
[Route("api/v1/attendees")]
[AllowAnonymous]
public class AttendeesController(IAttendeeService attendeeService) : ControllerBase
{
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

        var status = await attendeeService.GetAttendeeStatusAsync(eventId, cancellationToken);
        return Ok(status);
    }

    [HttpPost("events/{eventId:guid}")]
    [ProducesResponseType(typeof(RegisterAttendeeResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
        return Ok(response);
    }

    [HttpPatch("events/{eventId:guid}/consent")]
    [ProducesResponseType(typeof(UpdateConsentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

        var response = await attendeeService.UpdateConsentAsync(
            eventId,
            request,
            cancellationToken
        );
        return Ok(response);
    }
}
