using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Nory.Application.DTOs;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/dashboard")]
public class DashboardController(
    IEventService eventService,
    IMetricsService metricsService,
    IActivityLogService activityLogService,
    IDistributedCache cache,
    ILogger<DashboardController> logger
) : ControllerBase
{
    private const string DashboardCacheKey = "dashboard:overview";
    private const int DashboardOverviewCacheTtlSeconds = 60;

    [HttpGet("overview")]
    [ProducesResponseType(typeof(DashboardOverviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetDashboardOverview(CancellationToken cancellationToken)
    {
        try
        {
            var cachedData = await cache.GetStringAsync(DashboardCacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                logger.LogDebug("Returning dashboard data from cache");
                return Ok(JsonSerializer.Deserialize<DashboardOverviewDto>(cachedData));
            }

            var events = await eventService.GetEventsAsync(cancellationToken);

            if (events.Count == 0)
            {
                return Ok(new DashboardOverviewDto());
            }

            var eventIds = events.Select(e => e.Id).ToList();

            var metrics = await metricsService.GetAggregatedMetricsForEventsAsync(eventIds);
            var activities = await activityLogService.GetRecentActivitiesForEventsAsync(
                eventIds,
                20
            );

            var result = new DashboardOverviewDto
            {
                Events = events.ToList(),
                Analytics = metrics,
                RecentActivity = activities,
            };

            await CacheResultAsync(
                DashboardCacheKey,
                result,
                DashboardOverviewCacheTtlSeconds,
                cancellationToken
            );

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to get dashboard overview");
            return StatusCode(500, new { error = "Failed to load dashboard data" });
        }
    }

    private async Task CacheResultAsync<T>(
        string key,
        T data,
        int ttlSeconds,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(ttlSeconds),
            };

            var jsonData = JsonSerializer.Serialize(data);
            await cache.SetStringAsync(key, jsonData, options, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to cache data for key {Key}", key);
        }
    }
}
