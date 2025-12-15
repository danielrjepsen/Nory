import { apiClient } from '@/lib/api';
import { analyticsCache } from './cache';
import type {
    DashboardOverview,
    EventAnalyticsSummary,
    ActivityLogEntry,
    OrgAnalyticsSummary,
    PeriodType,
    RangePeriodType,
    TrackEventPayload,
    TrackEventResponse,
} from '../_types/analytics';

const CACHE_KEYS = {
    dashboardOverview: () => `dashboard:overview`,
    eventSummary: (eventId: string, periodType: PeriodType) =>
        `event:summary:${eventId}:${periodType}`,
} as const;

export class AnalyticsService {
    static async getDashboardOverview(): Promise<DashboardOverview> {
        const cacheKey = CACHE_KEYS.dashboardOverview();

        return analyticsCache.getOrSet(
            cacheKey,
            () => apiClient.get<DashboardOverview>(`/api/v1/dashboard/overview`)
        );
    }

    static async getEventSummary(
        eventId: string,
        periodType: PeriodType = 'Total'
    ): Promise<EventAnalyticsSummary> {
        return apiClient.get<EventAnalyticsSummary>(
            `/api/v1/analytics/events/${eventId}/summary`,
            { params: { periodType } }
        );
    }

    static async getEventAnalyticsRange(
        eventId: string,
        startDate: string,
        endDate: string,
        periodType: RangePeriodType = 'Daily'
    ): Promise<EventAnalyticsSummary[]> {
        return apiClient.get<EventAnalyticsSummary[]>(
            `/api/v1/analytics/events/${eventId}/range`,
            { params: { startDate, endDate, periodType } }
        );
    }

    static async getRecentActivity(
        eventId: string,
        limit = 50,
        offset = 0
    ): Promise<ActivityLogEntry[]> {
        return apiClient.get<ActivityLogEntry[]>(
            `/api/v1/analytics/events/${eventId}/activity`,
            { params: { limit, offset } }
        );
    }

    static async trackEvent(
        eventId: string,
        payload: TrackEventPayload
    ): Promise<TrackEventResponse> {
        return apiClient.post<TrackEventResponse>(
            `/api/v1/analytics/events/${eventId}/track`,
            {
                eventType: payload.eventType,
                data: payload.data ?? {},
                sessionId: payload.sessionId,
            }
        );
    }

    static async getAnalyticsSummary(
        eventIds: string[]
    ): Promise<OrgAnalyticsSummary & { events: EventAnalyticsSummary[] }> {
        if (eventIds.length === 0) {
            return {
                totalPhotosUploaded: 0,
                totalGuestAppOpens: 0,
                totalQrScans: 0,
                totalSlideshowViews: 0,
                totalGalleryViews: 0,
                liveGuestCount: 0,
                activeEvents: 0,
                events: [],
            };
        }

        const eventSummaries = await Promise.all(
            eventIds.map((eventId) => this.getEventSummary(eventId))
        );

        const totals = eventSummaries.reduce(
            (acc, summary) => ({
                totalPhotosUploaded: acc.totalPhotosUploaded + summary.totalPhotosUploaded,
                totalGuestAppOpens: acc.totalGuestAppOpens + summary.totalGuestAppOpens,
                totalQrScans: acc.totalQrScans + summary.totalQrScans,
                totalSlideshowViews: acc.totalSlideshowViews + summary.totalSlideshowViews,
                totalGalleryViews: acc.totalGalleryViews + (summary.totalGalleryViews ?? 0),
                liveGuestCount: acc.liveGuestCount + summary.liveGuestCount,
            }),
            {
                totalPhotosUploaded: 0,
                totalGuestAppOpens: 0,
                totalQrScans: 0,
                totalSlideshowViews: 0,
                totalGalleryViews: 0,
                liveGuestCount: 0,
            }
        );

        return {
            ...totals,
            activeEvents: eventSummaries.filter((s) => s.liveGuestCount > 0).length,
            events: eventSummaries,
        };
    }

    static clearCache(): void {
        analyticsCache.clear();
    }

    static invalidateDashboardCache(orgId: string): boolean {
        return analyticsCache.delete(CACHE_KEYS.dashboardOverview());
    }

    static invalidateEventCache(eventId: string, periodType?: PeriodType): number {
        if (periodType) {
            return analyticsCache.delete(CACHE_KEYS.eventSummary(eventId, periodType)) ? 1 : 0;
        }
        return analyticsCache.invalidateByPrefix(`event:summary:${eventId}:`);
    }

    static getCacheStats() {
        return analyticsCache.getStats();
    }
}

export function formatNumber(num: number): string {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
}

export function calculateChange(
    current: number,
    previous: number
): { value: string; positive: boolean; percentage: number } {
    if (previous === 0) {
        const percentage = current > 0 ? 100 : 0;
        return {
            value: current > 0 ? '+100%' : '0%',
            positive: current > 0,
            percentage,
        };
    }

    const percentage = ((current - previous) / previous) * 100;
    return {
        value: `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`,
        positive: percentage > 0,
        percentage,
    };
}