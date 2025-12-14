using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;

namespace Nory.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/analytics")]
public class AnalyticsController(
    IMetricsService metricsService,
    IActivityLogService activityLogService,
    IEventService eventService,
    ILogger<AnalyticsController> logger) : ControllerBase
{
    [HttpGet("events/{eventId:guid}/summary")]
    [ProducesResponseType(typeof(EventMetricsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEventSummary(
        Guid eventId,
        [FromQuery] string periodType = "Total",
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        // Verify user owns this event
        var eventData = await eventService.GetEventByIdAsync(eventId, userId, cancellationToken);
        if (eventData is null)
            return NotFound(new { error = "Event not found" });

        var period = ParsePeriodType(periodType);
        var metrics = await metricsService.GetEventMetricsAsync(eventId, period);

        return Ok(metrics);
    }

    [HttpGet("events/{eventId:guid}/activity")]
    [ProducesResponseType(typeof(List<ActivityLogDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEventActivity(
        Guid eventId,
        [FromQuery] int limit = 50,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized();

        // Verify user owns this event
        var eventData = await eventService.GetEventByIdAsync(eventId, userId, cancellationToken);
        if (eventData is null)
            return NotFound(new { error = "Event not found" });

        var activities = await activityLogService.GetRecentActivitiesForEventsAsync(
            [eventId],
            limit
        );

        return Ok(activities);
    }

    [HttpPost("events/{eventId:guid}/track")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(TrackEventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> TrackEvent(
        Guid eventId,
        [FromBody] TrackEventRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.EventType))
            return BadRequest(new { error = "EventType is required" });

        // Verify event exists and is public/live
        var eventData = await eventService.GetPublicEventAsync(eventId, cancellationToken: cancellationToken);
        if (eventData is null)
            return NotFound(new { error = "Event not found or not accessible" });

        var activityType = ParseActivityType(request.EventType);
        if (activityType is null)
        {
            logger.LogWarning("Unknown activity type: {EventType}", request.EventType);
            return BadRequest(new { error = $"Unknown event type: {request.EventType}" });
        }

        var data = request.Data is not null
            ? JsonDocument.Parse(JsonSerializer.Serialize(request.Data))
            : null;

        await activityLogService.RecordActivityAsync(
            eventId,
            activityType.Value,
            data,
            request.SessionId
        );

        return Ok(new TrackEventResponse
        {
            Success = true,
            Message = "Event tracked successfully"
        });
    }

    private static MetricsPeriodType ParsePeriodType(string periodType)
    {
        return Enum.TryParse<MetricsPeriodType>(periodType, true, out var result)
            ? result
            : MetricsPeriodType.Total;
    }

    private static ActivityType? ParseActivityType(string eventType)
    {
        return eventType.ToLowerInvariant() switch
        {
            "photo_upload" or "photo_uploaded" => ActivityType.PhotoUploaded,
            "guest_app_open" or "guest_app_opened" => ActivityType.GuestAppOpened,
            "qr_scan" or "qr_scanned" => ActivityType.QrCodeScanned,
            "slideshow_view" or "slideshow_viewed" => ActivityType.SlideshowViewed,
            "gallery_view" or "gallery_viewed" => ActivityType.GalleryViewed,
            _ => null
        };
    }

    private string? GetCurrentUserId() =>
        User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
}

public class TrackEventRequest
{
    public string EventType { get; init; } = string.Empty;
    public string? SessionId { get; init; }
    public Dictionary<string, object>? Data { get; init; }
}

public class TrackEventResponse
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}
