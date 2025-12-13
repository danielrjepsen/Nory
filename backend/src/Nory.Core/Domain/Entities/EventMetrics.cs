using System.Text.Json;
using Nory.Core.Domain.Enums;

namespace Nory.Core.Domain.Entities;

public class EventMetrics
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public MetricsPeriodType PeriodType { get; private set; }
    public DateTime? PeriodStart { get; private set; }
    public DateTime? PeriodEnd { get; private set; }

    public int TotalPhotosUploaded { get; private set; }
    public int TotalGuestAppOpens { get; private set; }
    public int TotalQrScans { get; private set; }
    public int TotalSlideshowViews { get; private set; }
    public int TotalGalleryViews { get; private set; }
    public int LiveGuestCount { get; private set; }

    public JsonDocument? FeatureUsage { get; private set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Constructor for EF Core reconstitution
    public EventMetrics(
        Guid id,
        Guid eventId,
        MetricsPeriodType periodType,
        DateTime? periodStart,
        DateTime? periodEnd,
        int totalPhotosUploaded,
        int totalGuestAppOpens,
        int totalQrScans,
        int totalSlideshowViews,
        int totalGalleryViews,
        int liveGuestCount,
        JsonDocument? featureUsage,
        DateTime createdAt,
        DateTime updatedAt)
    {
        Id = id;
        EventId = eventId;
        PeriodType = periodType;
        PeriodStart = periodStart;
        PeriodEnd = periodEnd;
        TotalPhotosUploaded = totalPhotosUploaded;
        TotalGuestAppOpens = totalGuestAppOpens;
        TotalQrScans = totalQrScans;
        TotalSlideshowViews = totalSlideshowViews;
        TotalGalleryViews = totalGalleryViews;
        LiveGuestCount = liveGuestCount;
        FeatureUsage = featureUsage;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    // Static factory method for creating new metrics
    public static EventMetrics Create(
        Guid eventId,
        MetricsPeriodType periodType,
        DateTime? periodStart = null,
        DateTime? periodEnd = null)
    {
        if (eventId == Guid.Empty)
            throw new ArgumentException("EventId is required", nameof(eventId));

        return new EventMetrics(
            id: Guid.NewGuid(),
            eventId: eventId,
            periodType: periodType,
            periodStart: periodStart,
            periodEnd: periodEnd,
            totalPhotosUploaded: 0,
            totalGuestAppOpens: 0,
            totalQrScans: 0,
            totalSlideshowViews: 0,
            totalGalleryViews: 0,
            liveGuestCount: 0,
            featureUsage: null,
            createdAt: DateTime.UtcNow,
            updatedAt: DateTime.UtcNow
        );
    }

    // Business methods
    public void IncrementPhotoUploads(int count = 1)
    {
        TotalPhotosUploaded += count;
        Touch();
    }

    public void IncrementGuestAppOpens(int count = 1)
    {
        TotalGuestAppOpens += count;
        Touch();
    }

    public void IncrementQrScans(int count = 1)
    {
        TotalQrScans += count;
        Touch();
    }

    public void IncrementSlideshowViews(int count = 1)
    {
        TotalSlideshowViews += count;
        Touch();
    }

    public void IncrementGalleryViews(int count = 1)
    {
        TotalGalleryViews += count;
        Touch();
    }

    public void UpdateLiveGuestCount(int count)
    {
        LiveGuestCount = Math.Max(0, count);
        Touch();
    }

    public void UpdateFeatureUsage(JsonDocument featureUsage)
    {
        FeatureUsage = featureUsage;
        Touch();
    }

    public void ResetMetrics()
    {
        TotalPhotosUploaded = 0;
        TotalGuestAppOpens = 0;
        TotalQrScans = 0;
        TotalSlideshowViews = 0;
        TotalGalleryViews = 0;
        LiveGuestCount = 0;
        FeatureUsage = null;
        Touch();
    }

    // Business query methods
    public bool HasActivity()
    {
        return TotalPhotosUploaded > 0
            || TotalGuestAppOpens > 0
            || TotalQrScans > 0
            || TotalSlideshowViews > 0
            || TotalGalleryViews > 0;
    }

    public bool IsTotalMetrics() => PeriodType == MetricsPeriodType.Total;

    public bool IsHourlyMetrics() => PeriodType == MetricsPeriodType.Hourly;

    public bool IsDailyMetrics() => PeriodType == MetricsPeriodType.Daily;

    public bool IsWeeklyMetrics() => PeriodType == MetricsPeriodType.Weekly;

    public bool IsMonthlyMetrics() => PeriodType == MetricsPeriodType.Monthly;

    public bool IsTimePeriodMetrics() => PeriodType != MetricsPeriodType.Total;

    public int GetTotalEngagement()
    {
        return TotalPhotosUploaded
            + TotalGuestAppOpens
            + TotalQrScans
            + TotalSlideshowViews
            + TotalGalleryViews;
    }

    // Helper methods for feature JsonDocument
    public T? GetFeatureValue<T>(string key)
    {
        if (FeatureUsage?.RootElement.TryGetProperty(key, out var value) == true)
        {
            try
            {
                return JsonSerializer.Deserialize<T>(value.GetRawText());
            }
            catch
            {
                return default;
            }
        }
        return default;
    }

    public bool HasFeature(string key)
    {
        return FeatureUsage?.RootElement.TryGetProperty(key, out _) == true;
    }

    private void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
