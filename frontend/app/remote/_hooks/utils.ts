import type { PublicEventData } from '@/app/_shared/types';
import type { EventTemplateResponse } from '../_services/types';
import type { EventTheme } from './types';

const GRACE_PERIOD_DAYS = 30;

export function isEventViewable(event: PublicEventData | null): boolean {
  if (!event) return false;
  if (event.status === 'live') return true;
  if (event.status === 'ended' && event.endsAt) {
    const gracePeriodMs = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() <= new Date(event.endsAt).getTime() + gracePeriodMs;
  }
  return false;
}

export function toEventTheme(template: EventTemplateResponse): EventTheme {
  const { name: themeName, displayName, ...colors } = template;
  return { ...colors, themeName };
}

export function getForceWelcome(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('welcome') === 'true';
}

export function getSessionStorage(eventId: string): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(`userName_${eventId}`);
}

export function setSessionStorage(eventId: string, name: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`userName_${eventId}`, name);
  }
}

export function clearSessionStorage(eventId: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`userName_${eventId}`);
  }
}

export function getReferrer(): string {
  return typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct';
}

export function getUserAgent(): string {
  return typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
}
