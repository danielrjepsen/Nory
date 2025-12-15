import { useCallback, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { getPublicEvent, getEventApps, getEventTemplate } from '../_services/guestApi';
import { DEFAULT_THEME, type UseEventDataReturn } from './types';
import { isEventViewable, toEventTheme } from './utils';

export type { EventTheme, UseEventDataReturn } from './types';

export function useEventData(eventId: string): UseEventDataReturn {
  const enabled = Boolean(eventId);

  const [eventQuery, appsQuery, themeQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.events.public(eventId),
        queryFn: () => getPublicEvent(eventId),
        enabled,
      },
      {
        queryKey: queryKeys.events.apps(eventId),
        queryFn: () => getEventApps(eventId),
        enabled,
      },
      {
        queryKey: queryKeys.events.template(eventId),
        queryFn: () => getEventTemplate(eventId),
        enabled,
      },
    ],
  });

  const eventTheme = useMemo(() => {
    const template = themeQuery.data?.template;
    return template ? toEventTheme(template) : DEFAULT_THEME;
  }, [themeQuery.data]);

  const error = useMemo(() => {
    const err = eventQuery.error;
    if (!err) return null;
    return err instanceof Error ? err.message : 'Failed to load event data';
  }, [eventQuery.error]);

  const refetch = useCallback(() => {
    eventQuery.refetch();
    appsQuery.refetch();
    themeQuery.refetch();
  }, [eventQuery, appsQuery, themeQuery]);

  return useMemo(
    () => ({
      eventData: eventQuery.data ?? null,
      apps: appsQuery.data ?? [],
      eventTheme,
      loading: eventQuery.isLoading || appsQuery.isLoading,
      error,
      themeLoading: themeQuery.isLoading,
      isEventViewable: isEventViewable(eventQuery.data ?? null),
      refetch,
    }),
    [eventQuery, appsQuery, eventTheme, error, themeQuery.isLoading, refetch]
  );
}
