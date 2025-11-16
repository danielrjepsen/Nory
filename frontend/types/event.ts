export type EventStatus = 'active' | 'completed' | 'draft';

export interface EventAnalytics {
    totalPhotosUploaded: number;
    totalQrScans: number;
    totalSlideshowViews: number;
    totalGuestAppOpens: number;
}

export interface EventData {
    id: string;
    name: string;
    date: string;
    location?: string;
    photoCount: number;
    status: EventStatus;
    isPublic: boolean;
    analytics?: EventAnalytics;
}