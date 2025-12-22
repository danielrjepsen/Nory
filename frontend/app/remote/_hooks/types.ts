import type { PublicEventData, EventApp, Photo, Category } from '@/app/_shared/types';

export interface EventTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor1?: string;
  backgroundColor2?: string;
  textPrimary?: string;
  textSecondary?: string;
  primaryFont?: string;
  secondaryFont?: string;
  themeName?: string;
  darkBackgroundGradient?: string;
  darkParticleColors?: string;
}

export interface UseEventDataReturn {
  eventData: PublicEventData | null;
  apps: EventApp[];
  eventTheme: EventTheme | null;
  loading: boolean;
  error: string | null;
  themeLoading: boolean;
  isEventViewable: boolean;
  refetch: () => void;
}

export interface SessionData {
  isRegistered: boolean;
  userName: string;
  hasPhotoRevealConsent: boolean;
}

export interface UseGuestSessionReturn {
  isMounted: boolean;
  showWelcome: boolean;
  userName: string;
  isRegistered: boolean;
  hasPhotoRevealConsent: boolean;
  isLoading: boolean;
  register: (name: string, email?: string, wantsMemories?: boolean) => Promise<void>;
  updateConsent: (email: string) => Promise<void>;
  clearSession: () => void;
}

export interface RegisterVariables {
  name: string;
  email?: string;
  wantsMemories: boolean;
}

export interface UsePhotoManagementReturn {
  photos: Photo[];
  categories: Category[];
  photosLoading: boolean;
  uploading: boolean;
  selectedPhotoIndex: number | null;
  imageModalOpen: boolean;
  selectedFiles: File[];
  selectedCategoryId: string;
  showUploadModal: boolean;
  setSelectedFiles: (files: File[]) => void;
  setSelectedCategoryId: (categoryId: string) => void;
  setShowUploadModal: (show: boolean) => void;
  refreshPhotos: () => Promise<void>;
  uploadPhotos: () => Promise<void>;
  openPhotoModal: (index: number) => void;
  closePhotoModal: () => void;
  nextPhoto: () => void;
  previousPhoto: () => void;
}

export const DEFAULT_THEME: EventTheme = {
  primaryColor: '#7877C6',
  secondaryColor: '#FF77C6',
  accentColor: '#E8B4FF',
  backgroundColor1: '#0f0f23',
  backgroundColor2: '#1a1625',
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  primaryFont: 'Playfair Display',
  secondaryFont: 'Inter',
  themeName: 'default',
};
