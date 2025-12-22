'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { WelcomeScreen } from '../_components/WelcomeScreen';
import { EventLoadingScreen } from '../_components/EventLoadingScreen';
import { EventNotFound } from '../_components/EventNotFound';
import { ThemeWrapper } from '../_components/ThemeWrapper';
import { GuestGallery } from '../_components/GuestGallery';
import { DebugTools } from '../_components/DebugTools';
import { useEventData } from '../_hooks/useEventData';
import { usePhotoManagement } from '../_hooks/usePhotoManagement';
import { useGuestSession } from '../_hooks/useGuestSession';

function getEventId(params: ReturnType<typeof useParams>): string | null {
  const eventId = params?.eventId;
  if (typeof eventId === 'string' && eventId.length > 0) {
    return eventId;
  }
  return null;
}

export default function EventGuestApp() {
  const params = useParams();
  const { t } = useTranslation('remote');
  const eventId = getEventId(params);

  const eventDataResult = useEventData(eventId ?? '');
  const photoManagement = usePhotoManagement(eventId ?? '');
  const guestSession = useGuestSession(eventId ?? '', photoManagement.refreshPhotos);

  if (!eventId) {
    return <EventNotFound error={t('common.eventNotFound.title')} eventId="" />;
  }

  if (!guestSession.isMounted || eventDataResult.loading || eventDataResult.themeLoading) {
    return (
      <EventLoadingScreen
        eventTheme={eventDataResult.eventTheme}
        eventData={eventDataResult.eventData}
      />
    );
  }

  if (eventDataResult.error || !eventDataResult.eventData) {
    return (
      <EventNotFound
        error={eventDataResult.error || t('common.eventNotFound.title')}
        eventId={eventId}
      />
    );
  }

  if (!eventDataResult.isEventViewable) {
    return <EventNotFound error={t('common.eventEnded')} eventId={eventId} />;
  }

  if (guestSession.showWelcome) {
    return (
      <WelcomeScreen
        eventId={eventId}
        eventName={eventDataResult.eventData.name}
        onNameSubmit={guestSession.register}
      />
    );
  }

  return (
    <ThemeWrapper eventTheme={eventDataResult.eventTheme} isMounted={guestSession.isMounted}>
      <GuestGallery
        eventData={eventDataResult.eventData}
        eventTheme={eventDataResult.eventTheme}
        apps={eventDataResult.apps}
        photoManagement={photoManagement}
        onMemoryOptInSuccess={guestSession.updateConsent}
      />
      <DebugTools eventId={eventId} onClearSession={guestSession.clearSession} />
    </ThemeWrapper>
  );
}