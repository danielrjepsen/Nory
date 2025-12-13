using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Events;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[ApiController]
[Route("api/v1/events")]
[Authorize]
public class EventsController(IEventService eventService) : ControllerBase
{
    /// <summary>
    /// Get all events for the current user
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<EventDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEvents(CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        var events = await eventService.GetEventsAsync(userId, cancellationToken);
        return Ok(events);
    }

    /// <summary>
    /// Get a specific event by ID
    /// </summary>
    [HttpGet("{eventId:guid}")]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEvent(Guid eventId, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        var eventDto = await eventService.GetEventByIdAsync(eventId, userId, cancellationToken);
        if (eventDto is null)
            return NotFound(new { message = "Event not found" });

        return Ok(eventDto);
    }

    /// <summary>
    /// Get a public event (for guest/slideshow access)
    /// </summary>
    [HttpGet("public/{eventId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetPublicEvent(
        Guid eventId,
        [FromQuery] bool preview = false,
        CancellationToken cancellationToken = default
    )
    {
        var eventDto = await eventService.GetPublicEventAsync(eventId, preview, cancellationToken);

        if (eventDto is null)
            return NotFound(new { message = "Event not found" });

        if (eventDto.Status == "ended")
            return StatusCode(
                StatusCodes.Status410Gone,
                new
                {
                    message = "This event has ended",
                    status = "ended",
                    endsAt = eventDto.EndsAt,
                }
            );

        if (eventDto.Status == "draft" && !preview)
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { message = "This event is not yet live", status = "draft" }
            );

        return Ok(eventDto);
    }

    /// <summary>
    /// Create a new event
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateEvent(
        [FromBody] CreateEventDto dto,
        CancellationToken cancellationToken
    )
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        try
        {
            var eventDto = await eventService.CreateEventAsync(dto, userId, cancellationToken);
            return CreatedAtAction(nameof(GetEvent), new { eventId = eventDto.Id }, eventDto);
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage });
            return BadRequest(new { message = "Validation failed", errors });
        }
    }

    /// <summary>
    /// Update an existing event
    /// </summary>
    [HttpPatch("{eventId:guid}")]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateEvent(
        Guid eventId,
        [FromBody] UpdateEventDto dto,
        CancellationToken cancellationToken
    )
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        try
        {
            var eventDto = await eventService.UpdateEventAsync(
                eventId,
                dto,
                userId,
                cancellationToken
            );
            return Ok(eventDto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Event not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage });
            return BadRequest(new { message = "Validation failed", errors });
        }
    }

    /// <summary>
    /// Delete (archive) an event
    /// </summary>
    [HttpDelete("{eventId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteEvent(Guid eventId, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        try
        {
            await eventService.DeleteEventAsync(eventId, userId, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Event not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Start an event (change status from Draft to Live)
    /// </summary>
    [HttpPost("{eventId:guid}/start")]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> StartEvent(Guid eventId, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        try
        {
            var eventDto = await eventService.StartEventAsync(eventId, userId, cancellationToken);
            return Ok(eventDto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Event not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// End an event (change status from Live to Ended)
    /// </summary>
    [HttpPost("{eventId:guid}/end")]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> EndEvent(Guid eventId, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        try
        {
            var eventDto = await eventService.EndEventAsync(eventId, userId, cancellationToken);
            return Ok(eventDto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Event not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get photos for an event (dashboard view - limited)
    /// </summary>
    [HttpGet("{eventId:guid}/photos/dashboard")]
    [ProducesResponseType(typeof(IReadOnlyList<EventPhotoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEventPhotosDashboard(
        Guid eventId,
        [FromQuery] int limit = 6,
        CancellationToken cancellationToken = default
    )
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        var eventDto = await eventService.GetEventByIdAsync(eventId, userId, cancellationToken);
        if (eventDto is null)
            return NotFound(new { message = "Event not found" });

        // For now, return empty array - photo upload functionality comes later
        return Ok(Array.Empty<EventPhotoDto>());
    }

    private string? GetCurrentUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
}

/// <summary>
/// DTO for event photos
/// </summary>
public record EventPhotoDto(
    Guid Id,
    string CdnUrl,
    string OriginalFileName,
    string? UploadedBy,
    int? Width,
    int? Height,
    DateTime CreatedAt
);
