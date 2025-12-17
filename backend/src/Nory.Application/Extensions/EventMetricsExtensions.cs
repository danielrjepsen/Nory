using Nory.Application.DTOs;
using Nory.Core.Domain.Entities;

namespace Nory.Application.Extensions;

public static class EventMetricsExtensions
{
    public static EventMetricsDto MapToDto(this EventMetrics metrics)
    {
        return new EventMetricsDto
        {
            EventId = metrics.EventId,
            PeriodType = metrics.PeriodType,
            PeriodStart = metrics.PeriodStart,
            PeriodEnd = metrics.PeriodEnd,
            TotalPhotosUploaded = metrics.TotalPhotosUploaded,
            TotalGuestAppOpens = metrics.TotalGuestAppOpens,
            TotalQrScans = metrics.TotalQrScans,
            TotalSlideshowViews = metrics.TotalSlideshowViews,
            TotalGalleryViews = metrics.TotalGalleryViews,
            LiveGuestCount = metrics.LiveGuestCount,
            TotalGuestRegistrations = metrics.TotalGuestRegistrations,
            TotalConsentUpdates = metrics.TotalConsentUpdates,
            TotalGuestbookEntries = metrics.TotalGuestbookEntries,
            UpdatedAt = metrics.UpdatedAt,
        };
    }
}
