using System.Text.Json;
using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class AnalyticsMappingExtensions
{
    // ActivityLog mappings
    public static ActivityLog MapToDomain(this ActivityLogDbModel dbModel)
    {
        return new ActivityLog(
            id: dbModel.Id,
            eventId: dbModel.EventId,
            type: dbModel.Type,
            data: dbModel.Data,
            sessionId: dbModel.SessionId,
            createdAt: dbModel.CreatedAt,
            isProcessed: dbModel.IsProcessed
        );
    }

    public static ActivityLogDbModel MapToDbModel(this ActivityLog domainActivity)
    {
        return new ActivityLogDbModel
        {
            Id = domainActivity.Id,
            EventId = domainActivity.EventId,
            Type = domainActivity.Type,
            Data = domainActivity.Data,
            SessionId = domainActivity.SessionId,
            CreatedAt = domainActivity.CreatedAt,
            IsProcessed = domainActivity.IsProcessed,
        };
    }

    // EventMetrics mappings
    public static EventMetrics MapToDomain(this EventMetricsDbModel dbModel)
    {
        return new EventMetrics(
            id: dbModel.Id,
            eventId: dbModel.EventId,
            periodType: dbModel.PeriodType,
            periodStart: dbModel.PeriodStart,
            periodEnd: dbModel.PeriodEnd,
            totalPhotosUploaded: dbModel.TotalPhotosUploaded,
            totalGuestAppOpens: dbModel.TotalGuestAppOpens,
            totalQrScans: dbModel.TotalQrScans,
            totalSlideshowViews: dbModel.TotalSlideshowViews,
            totalGalleryViews: dbModel.TotalGalleryViews,
            liveGuestCount: dbModel.LiveGuestCount,
            totalGuestRegistrations: dbModel.TotalGuestRegistrations,
            totalConsentUpdates: dbModel.TotalConsentUpdates,
            totalGuestbookEntries: dbModel.TotalGuestbookEntries,
            featureUsage: dbModel.FeatureUsage,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt
        );
    }

    public static EventMetricsDbModel MapToDbModel(this EventMetrics domainMetrics)
    {
        return new EventMetricsDbModel
        {
            Id = domainMetrics.Id,
            EventId = domainMetrics.EventId,
            PeriodType = domainMetrics.PeriodType,
            PeriodStart = domainMetrics.PeriodStart,
            PeriodEnd = domainMetrics.PeriodEnd,
            TotalPhotosUploaded = domainMetrics.TotalPhotosUploaded,
            TotalGuestAppOpens = domainMetrics.TotalGuestAppOpens,
            TotalQrScans = domainMetrics.TotalQrScans,
            TotalSlideshowViews = domainMetrics.TotalSlideshowViews,
            TotalGalleryViews = domainMetrics.TotalGalleryViews,
            LiveGuestCount = domainMetrics.LiveGuestCount,
            TotalGuestRegistrations = domainMetrics.TotalGuestRegistrations,
            TotalConsentUpdates = domainMetrics.TotalConsentUpdates,
            TotalGuestbookEntries = domainMetrics.TotalGuestbookEntries,
            FeatureUsage = domainMetrics.FeatureUsage,
            CreatedAt = domainMetrics.CreatedAt,
            UpdatedAt = domainMetrics.UpdatedAt,
        };
    }

    // Batch mappings for ActivityLog
    public static List<ActivityLog> MapToDomain(this IEnumerable<ActivityLogDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }

    public static List<ActivityLogDbModel> MapToDbModel(
        this IEnumerable<ActivityLog> domainActivities
    )
    {
        return domainActivities.Select(a => a.MapToDbModel()).ToList();
    }

    // Batch mappings for EventMetrics
    public static List<EventMetrics> MapToDomain(this IEnumerable<EventMetricsDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }

    public static List<EventMetricsDbModel> MapToDbModel(
        this IEnumerable<EventMetrics> domainMetrics
    )
    {
        return domainMetrics.Select(m => m.MapToDbModel()).ToList();
    }
}
