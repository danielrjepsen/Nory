export interface GuestbookEntry {
  id: string;
  eventId: string;
  appInstanceId: string;
  name: string;
  message: string;
  email?: string;
  hasPhoto: boolean;
  status: 'active' | 'hidden' | 'pending';
  createdAt: string;
  data: Record<string, unknown>;
}

export interface SessionState {
  isRegistered: boolean;
  userName: string | null;
  hasPhotoRevealConsent: boolean;
  showWelcome: boolean;
}

export interface UploadState {
  uploading: boolean;
  selectedFiles: File[];
  selectedCategoryId: string;
  showModal: boolean;
}

export interface GalleryState {
  photos: Photo[];
  categories: Category[];
  selectedPhotoIndex: number | null;
  imageModalOpen: boolean;
  photosLoading: boolean;
}

export interface LoadingState {
  loading: boolean;
  minLoadingTime: boolean;
  hasLoadedOnce: boolean;
  themeLoading: boolean;
}

export interface ErrorState {
  error: string | null;
  hasError: boolean;
}

export interface AttendeeStatus {
  isRegistered: boolean;
  hasPhotoRevealConsent: boolean;
  name: string | null;
  email: string | null;
}

export interface RegisterAttendeeRequest {
  name: string;
  email?: string;
  wantsPhotoReveal: boolean;
  eventRole: string;
}

export interface RegisterAttendeeResponse {
  success: boolean;
  attendeeId: string;
  message: string;
}

export interface UpdateConsentRequest {
  wantsPhotoReveal: boolean;
  email: string;
}

import type { EventPhoto, EventStatus } from '@/app/dashboard/_types/events';
export type { EventPhoto, EventStatus };

export interface Photo {
  id: string;
  imageUrl: string;
  originalFileName: string;
  uploadedBy: string;
  categoryId: string | null;
  width?: number;
  height?: number;
  createdAt: string;
  contentType?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isDefault?: boolean;
}

export interface PublicEventData {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'live' | 'ended';
  startsAt?: string;
  endsAt?: string;
  organizerName?: string;
  location?: string;
  isPublic: boolean;
  maxPhotos?: number;
  allowGuestUploads: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventApp {
  id: string;
  eventId: string;
  appType: {
    id: string;
    name: string;
    component: string;
    icon?: string;
    color?: string;
    description?: string;
  };
  configuration: Record<string, unknown>;
  sortOrder: number;
  isEnabled: boolean;
}

export interface AppData {
  id: string;
  name: string;
  type: string;
  icon?: string;
  config?: Record<string, unknown>;
}
