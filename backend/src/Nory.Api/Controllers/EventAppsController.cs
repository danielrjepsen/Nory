using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.EventApps;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[ApiController]
[Route("api/v1/events/{eventId:guid}/apps")]
[AllowAnonymous]
public class EventAppsController(IEventAppService eventAppService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<EventAppDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEventApps(Guid eventId, CancellationToken cancellationToken)
    {
        var eventExists = await eventAppService.EventExistsAsync(eventId, cancellationToken);
        if (!eventExists)
        {
            return NotFound(new { message = "Event not found" });
        }

        var apps = await eventAppService.GetEventAppsAsync(eventId, cancellationToken);
        return Ok(apps);
    }

    [HttpGet("{appId}")]
    [ProducesResponseType(typeof(EventAppDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEventApp(
        Guid eventId,
        string appId,
        CancellationToken cancellationToken
    )
    {
        var eventExists = await eventAppService.EventExistsAsync(eventId, cancellationToken);
        if (!eventExists)
        {
            return NotFound(new { message = "Event not found" });
        }

        var app = await eventAppService.GetEventAppAsync(eventId, appId, cancellationToken);
        if (app is null)
        {
            return NotFound(new { message = "App not found or not enabled for this event" });
        }

        return Ok(app);
    }
}
