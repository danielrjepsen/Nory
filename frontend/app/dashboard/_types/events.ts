export type EventStatus = 'live' | 'draft' | 'ended';

export interface EventAnalytics {
  totalPhotosUploaded: number;
  totalQrScans: number;
  totalSlideshowViews: number;
  totalGuestAppOpens: number;
}

export interface EventData {
  id: string;
  name: string;
  description?: string;
  date: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  photoCount: number;
  status: EventStatus;
  isPublic: boolean;
  hasContent?: boolean;
  analytics?: EventAnalytics;
}

export interface EventPhoto {
  id: string;
  imageUrl: string;
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

export interface CreateEventRequest {
  name: string;
  description?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  isPublic?: boolean;
  themeName?: string;
  guestAppConfig?: any;
  status?: EventStatus;
}

// Form data for create/edit event flows
export interface EventFormData {
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  isPublic: boolean;
  themeName: string;
  guestApp: {
    config: GuestAppConfig;
    components: any[];
  };
}

export interface GuestAppConfig {
  version: string;
  event: {
    name: string;
    welcome: string;
  };
  components: any[];
  timestamp: string;
}

export interface ThemePreset {
  name: string;
  displayName: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  primaryFont?: string;
}

export interface EventSlotsInfo {
  available: number;
  total: number;
  loading: boolean;
}

export const CREATE_EVENT_STEPS = [
  'Event Details',
  'Guest App',
  'Payment',
  'Review & Create'
] as const;

export type CreateEventStep = typeof CREATE_EVENT_STEPS[number];
