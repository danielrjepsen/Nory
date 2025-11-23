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

export interface EventPhoto {
  id: string;
  cdnUrl: string;
  originalFileName: string;
  uploadedBy: string;
  categoryId?: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface EventPhotosResponse {
  photos: EventPhoto[];
  total: number;
  limit: number;
  offset: number;
}
