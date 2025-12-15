import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import {
  getAttendeeStatus,
  registerAttendee,
  updateAttendeeConsent,
  trackEvent,
} from '../_services/guestApi';
import {
  getForceWelcome,
  setSessionStorage,
  clearSessionStorage,
  getReferrer,
  getUserAgent,
} from './utils';
import { AnalyticsEvents } from '../_constants/analytics';
import type { SessionData, UseGuestSessionReturn, RegisterVariables } from './types';

type AttendeeStatusResponse = Awaited<ReturnType<typeof getAttendeeStatus>>;

const EMPTY_SESSION: SessionData = {
  isRegistered: false,
  userName: '',
  hasPhotoRevealConsent: false,
};

function toSessionData(data: AttendeeStatusResponse | undefined): SessionData {
  if (!data?.isRegistered || !data.name) return EMPTY_SESSION;
  return {
    isRegistered: true,
    userName: data.name,
    hasPhotoRevealConsent: data.hasPhotoRevealConsent ?? false,
  };
}

export function useGuestSession(eventId: string): UseGuestSessionReturn {
  const queryClient = useQueryClient();
  const hasTrackedOpen = useRef(false);
  const [forceShowWelcome, setForceShowWelcome] = useState(getForceWelcome);

  const { data: session = EMPTY_SESSION, isLoading: statusLoading } = useQuery({
    queryKey: queryKeys.attendees.status(eventId),
    queryFn: () => getAttendeeStatus(eventId),
    select: toSessionData,
    enabled: Boolean(eventId) && !forceShowWelcome,
    staleTime: 60_000,
    retry: 1,
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, wantsMemories }: RegisterVariables) =>
      registerAttendee(eventId, {
        name: name.trim(),
        email: wantsMemories ? email?.trim() : undefined,
        wantsPhotoReveal: wantsMemories,
        eventRole: 'guest',
      }),
    onSuccess: (_, { name, email, wantsMemories }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendees.status(eventId) });
      setSessionStorage(eventId, name.trim());
      trackEvent(eventId, AnalyticsEvents.GuestRegistered, { hasEmail: !!email, wantsMemories });
    },
  });

  const consentMutation = useMutation({
    mutationFn: (email: string) =>
      updateAttendeeConsent(eventId, { wantsPhotoReveal: true, email: email.trim() }),
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendees.status(eventId) });
      trackEvent(eventId, AnalyticsEvents.ConsentUpdated, { hasEmail: !!email });
    },
  });

  const showWelcome = forceShowWelcome || (!statusLoading && !session.isRegistered);

  useEffect(() => {
    if (!eventId || hasTrackedOpen.current) return;
    hasTrackedOpen.current = true;
    trackEvent(eventId, AnalyticsEvents.GuestAppOpened, { referrer: getReferrer(), userAgent: getUserAgent() });
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    if (session.isRegistered && session.userName) {
      setSessionStorage(eventId, session.userName);
    } else if (!statusLoading && !session.isRegistered) {
      clearSessionStorage(eventId);
    }
  }, [eventId, session, statusLoading]);

  const register = useCallback(
    async (name: string, email?: string, wantsMemories = false) => {
      await registerMutation.mutateAsync({ name, email, wantsMemories });
      setForceShowWelcome(false);
    },
    [registerMutation]
  );

  const updateConsent = useCallback(
    async (email: string) => {
      await consentMutation.mutateAsync(email);
    },
    [consentMutation]
  );

  const clearSession = useCallback(() => {
    clearSessionStorage(eventId);
    queryClient.removeQueries({ queryKey: queryKeys.attendees.status(eventId) });
    setForceShowWelcome(true);
  }, [eventId, queryClient]);

  return {
    showWelcome,
    userName: session.userName,
    isRegistered: session.isRegistered,
    hasPhotoRevealConsent: session.hasPhotoRevealConsent,
    isLoading: statusLoading || registerMutation.isPending || consentMutation.isPending,
    register,
    updateConsent,
    clearSession,
  };
}
