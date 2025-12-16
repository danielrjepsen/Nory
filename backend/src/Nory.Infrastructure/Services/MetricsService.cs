using Microsoft.Extensions.Logging;
using Nory.Application.DTOs;
using Nory.Application.Extensions;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class MetricsService : IMetricsService
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ILogger<MetricsService> _logger;

    public MetricsService(
        IAnalyticsRepository analyticsRepository,
        ILogger<MetricsService> logger)
    {
        _analyticsRepository = analyticsRepository;
        _logger = logger;
    }

    public async Task<AggregatedEventMetricsDto> GetAggregatedMetricsForEventsAsync(
        List<Guid> eventIds)
    {
        if (!eventIds.Any())
        {
            return new AggregatedEventMetricsDto();
        }

        var allMetrics = await _analyticsRepository.GetMetricsForEventsAsync(
            eventIds,
            MetricsPeriodType.Total
        );

        if (!allMetrics.Any())
        {
            _logger.LogWarning(
                "No metrics found for events: {EventIds}",
                string.Join(", ", eventIds)
            );

            return new AggregatedEventMetricsDto();
        }

        return new AggregatedEventMetricsDto
        {
            TotalPhotosUploaded = allMetrics.Sum(m => m.TotalPhotosUploaded),
            TotalGuestAppOpens = allMetrics.Sum(m => m.TotalGuestAppOpens),
            TotalQrScans = allMetrics.Sum(m => m.TotalQrScans),
            TotalSlideshowViews = allMetrics.Sum(m => m.TotalSlideshowViews),
            TotalGalleryViews = allMetrics.Sum(m => m.TotalGalleryViews),
            LiveGuestCount = allMetrics.Sum(m => m.LiveGuestCount),
            ActiveEvents = allMetrics.Count(m => m.LiveGuestCount > 0),
        };
    }

    public async Task<EventMetricsDto> GetEventMetricsAsync(
        Guid eventId,
        MetricsPeriodType periodType)
    {
        var metrics = await _analyticsRepository.GetMetricsAsync(eventId, periodType);

        if (metrics == null)
        {
            _logger.LogWarning(
                "No metrics found for event {EventId} with period {PeriodType}",
                eventId,
                periodType
            );

            return new EventMetricsDto { EventId = eventId };
        }

        return metrics.MapToDto();
    }

    public async Task UpdateMetricsForEventsAsync(List<Guid> eventIds)
    {
        _logger.LogInformation("Updating metrics for {EventCount} events", eventIds.Count);

        var unprocessedActivities = await _analyticsRepository.GetUnprocessedActivitiesAsync();
        if (!unprocessedActivities.Any()) return;

        var relevantActivities = unprocessedActivities
            .Where(a => eventIds.Contains(a.EventId))
            .ToList();

        if (!relevantActivities.Any()) return;

        var activitiesByEvent = relevantActivities.GroupBy(a => a.EventId);

        foreach (var eventGroup in activitiesByEvent)
        {
            var eventId = eventGroup.Key;
            var metrics = await _analyticsRepository.GetMetricsAsync(eventId, MetricsPeriodType.Total)
                ?? Core.Domain.Entities.EventMetrics.Create(eventId, MetricsPeriodType.Total);

            foreach (var activity in eventGroup)
            {
                switch (activity.Type)
                {
                    case ActivityType.PhotoUploaded:
                        metrics.IncrementPhotoUploads();
                        break;
                    case ActivityType.GuestAppOpened:
                        metrics.IncrementGuestAppOpens();
                        break;
                    case ActivityType.QrCodeScanned:
                        metrics.IncrementQrScans();
                        break;
                    case ActivityType.SlideshowViewed:
                        metrics.IncrementSlideshowViews();
                        break;
                    case ActivityType.GalleryViewed:
                        metrics.IncrementGalleryViews();
                        break;
                }
            }

            await _analyticsRepository.UpsertMetricsAsync(metrics);
        }

        var activityIds = relevantActivities.Select(a => a.Id).ToList();
        await _analyticsRepository.MarkActivitiesAsProcessedAsync(activityIds);

        await _analyticsRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Successfully processed {ActivityCount} activities for {EventCount} events",
            relevantActivities.Count,
            activitiesByEvent.Count()
        );
    }
}
