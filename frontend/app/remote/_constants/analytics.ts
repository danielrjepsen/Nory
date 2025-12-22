export const AnalyticsEvents = {
  GuestAppOpened: 'guest_app_opened',
  AppOpened: 'app_opened',
  PhotoUploaded: 'photo_uploaded',
  QrCodeScanned: 'qr_scanned',
  SlideshowViewed: 'slideshow_viewed',
  GalleryViewed: 'gallery_viewed',
  GuestRegistered: 'guest_registered',
  ConsentUpdated: 'consent_updated',
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
