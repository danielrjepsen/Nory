
export interface EventAnalyticsSummary {
    eventId: string;
    periodType: 'Total' | 'Daily' | 'Weekly' | 'Monthly';
    periodStart?: string;
    periodEnd?: string;
    totalGuestAppOpens: number;
    uniqueGuestAppVisitors: number;
    totalPhotosUploaded: number;
    totalPhotoViews: number;
    totalPhotoDownloads: number;
    totalQrScans: number;
    uniqueQrScanners: number;
    totalSlideshowViews: number;
    totalSlideshowCasts: number;
    totalSlideshowControls: number;
    uniqueSlideshowViewers: number;
    totalGalleryViews: number;
    uniqueGalleryViewers: number;
    totalGuestbookEntries: number;
    totalSessions: number;
    liveGuestCount: number;
    lastUpdated: string;
}

export interface ActivityLogEntry {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    data: Record<string, any>;
    eventId?: string;
    eventName?: string;
}

export interface DashboardOverview {
    events: EventSummary[];
    analytics: OrgAnalyticsSummary;
    recentActivity: ActivityLogEntry[];
}

export interface EventSummary {
    id: string;
    name: string;
    status: string;
    isPublic: boolean;
    location?: string;
    startsAt?: string;
    endsAt?: string;
    photoCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface OrgAnalyticsSummary {
    totalPhotosUploaded: number;
    totalGuestAppOpens: number;
    totalQrScans: number;
    totalSlideshowViews: number;
    totalGalleryViews: number;
    liveGuestCount: number;
    activeEvents: number;
}

export type PeriodType = 'Total' | 'Daily' | 'Weekly' | 'Monthly';
export type RangePeriodType = 'Daily' | 'Weekly' | 'Monthly';

export interface TrackEventPayload {
    eventType: string;
    data?: Record<string, unknown>;
    sessionId?: string;
}

export interface TrackEventResponse {
    success: boolean;
    message: string;
}
