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

const Endpoints = {
    overview: '/api/v1/dashboard/overview',
    summary: (id: string) => `/api/v1/analytics/events/${id}/summary`,
    range: (id: string) => `/api/v1/analytics/events/${id}/range`,
    activity: (id: string) => `/api/v1/analytics/events/${id}/activity`,
    track: (id: string) => `/api/v1/analytics/events/${id}/track`,
} as const;

const CacheKeys = {
    overview: 'dashboard:overview',
    summary: (id: string, period: PeriodType) => `summary:${id}:${period}`,
} as const;

const EMPTY_SUMMARY: OrgAnalyticsSummary & { events: EventAnalyticsSummary[] } = {
    totalPhotosUploaded: 0,
    totalGuestAppOpens: 0,
    totalQrScans: 0,
    totalSlideshowViews: 0,
    totalGalleryViews: 0,
    liveGuestCount: 0,
    activeEvents: 0,
    events: [],
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
    return analyticsCache.getOrSet(CacheKeys.overview, () => apiClient.get<DashboardOverview>(Endpoints.overview));
}

export async function getEventSummary(eventId: string, periodType: PeriodType = 'Total'): Promise<EventAnalyticsSummary> {
    return apiClient.get<EventAnalyticsSummary>(Endpoints.summary(eventId), { params: { periodType } });
}

export async function getEventAnalyticsRange(
    eventId: string,
    startDate: string,
    endDate: string,
    periodType: RangePeriodType = 'Daily'
): Promise<EventAnalyticsSummary[]> {
    return apiClient.get<EventAnalyticsSummary[]>(Endpoints.range(eventId), { params: { startDate, endDate, periodType } });
}

export async function getRecentActivity(eventId: string, limit = 50, offset = 0): Promise<ActivityLogEntry[]> {
    return apiClient.get<ActivityLogEntry[]>(Endpoints.activity(eventId), { params: { limit, offset } });
}

export async function trackEvent(eventId: string, payload: TrackEventPayload): Promise<TrackEventResponse> {
    return apiClient.post<TrackEventResponse>(Endpoints.track(eventId), {
        eventType: payload.eventType,
        data: payload.data ?? {},
        sessionId: payload.sessionId,
    });
}

export async function getAnalyticsSummary(eventIds: string[]): Promise<OrgAnalyticsSummary & { events: EventAnalyticsSummary[] }> {
    if (eventIds.length === 0) return EMPTY_SUMMARY;

    const summaries = await Promise.all(eventIds.map((id) => getEventSummary(id)));

    const totals = summaries.reduce(
        (acc, s) => ({
            totalPhotosUploaded: acc.totalPhotosUploaded + s.totalPhotosUploaded,
            totalGuestAppOpens: acc.totalGuestAppOpens + s.totalGuestAppOpens,
            totalQrScans: acc.totalQrScans + s.totalQrScans,
            totalSlideshowViews: acc.totalSlideshowViews + s.totalSlideshowViews,
            totalGalleryViews: acc.totalGalleryViews + (s.totalGalleryViews ?? 0),
            liveGuestCount: acc.liveGuestCount + s.liveGuestCount,
        }),
        { totalPhotosUploaded: 0, totalGuestAppOpens: 0, totalQrScans: 0, totalSlideshowViews: 0, totalGalleryViews: 0, liveGuestCount: 0 }
    );

    return { ...totals, activeEvents: summaries.filter((s) => s.liveGuestCount > 0).length, events: summaries };
}

export function invalidateOverview(): boolean {
    return analyticsCache.delete(CacheKeys.overview);
}

export function invalidateEventSummary(eventId: string, periodType?: PeriodType): number {
    if (periodType) return analyticsCache.delete(CacheKeys.summary(eventId, periodType)) ? 1 : 0;
    return analyticsCache.invalidateByPrefix(`summary:${eventId}:`);
}

export function clearCache(): void {
    analyticsCache.clear();
}

export function formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
}

export function calculateChange(current: number, previous: number): { value: string; positive: boolean; percentage: number } {
    if (previous === 0) {
        const percentage = current > 0 ? 100 : 0;
        return { value: current > 0 ? '+100%' : '0%', positive: current > 0, percentage };
    }
    const percentage = ((current - previous) / previous) * 100;
    return { value: `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`, positive: percentage > 0, percentage };
}
