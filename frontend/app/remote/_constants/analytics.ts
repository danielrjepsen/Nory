export const AnalyticsEvents = {
  GuestAppOpened: 'GuestAppOpened',
  GuestRegistered: 'GuestRegistered',
  ConsentUpdated: 'ConsentUpdated',
  PhotoUploaded: 'PhotoUploaded',
  AppOpened: 'AppOpened',
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
