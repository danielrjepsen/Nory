using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;
using Nory.Infrastructure.Persistence;

namespace Nory.Infrastructure.Jobs;

public class MetricsUpdateJob(
    IMetricsService metricsService,
    ApplicationDbContext dbContext,
    ILogger<MetricsUpdateJob> logger)
{
    public async Task UpdateAllMetricsAsync()
    {
        logger.LogInformation("Starting metrics update job");

        try
        {
            // Get all active event IDs directly from DB for background job
            var eventIds = await dbContext.Events
                .Where(e => e.Status != EventStatus.Archived)
                .Select(e => e.Id)
                .ToListAsync();

            if (eventIds.Count == 0)
            {
                logger.LogInformation("No events to update metrics for");
                return;
            }

            await metricsService.UpdateMetricsForEventsAsync(eventIds);
            logger.LogInformation("Metrics updated for {EventCount} events", eventIds.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to update metrics");
            throw; // Hangfire will retry
        }
    }
}
