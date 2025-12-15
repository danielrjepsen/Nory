import { useMemo, useEffect, useRef } from 'react';
import { useEventData, type UseEventDataReturn } from './useEventData';
import { trackEvent } from '../_services/guestApi';
import { AnalyticsEvents } from '../_constants/analytics';
import type { AppData, EventApp } from '@/app/_shared/types';

export interface UseEventAppReturn extends UseEventDataReturn {
  appData: AppData | null;
  appError: string | null;
}

function findAppData(apps: EventApp[], appId: string): AppData | null {
  const app = apps.find((a) => a.appType.component === appId);
  if (!app) return null;
  return {
    id: app.id,
    name: app.appType.name,
    type: app.appType.component,
    icon: app.appType.icon,
    config: app.configuration as Record<string, unknown>,
  };
}

export function useEventApp(eventId: string, appId: string): UseEventAppReturn {
  const eventData = useEventData(eventId);
  const hasTracked = useRef(false);

  const appData = useMemo(
    () => (eventData.loading ? null : findAppData(eventData.apps, appId)),
    [eventData.apps, eventData.loading, appId]
  );

  const appError = useMemo(() => {
    if (eventData.loading || !eventData.apps.length) return null;
    if (!appData) return `App '${appId}' not found`;
    return null;
  }, [eventData.loading, eventData.apps.length, appData, appId]);

  useEffect(() => {
    if (eventId && appId && !hasTracked.current) {
      hasTracked.current = true;
      trackEvent(eventId, AnalyticsEvents.AppOpened, { appId });
    }
  }, [eventId, appId]);

  return { ...eventData, appData, appError };
}
