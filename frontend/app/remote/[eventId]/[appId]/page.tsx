'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEventApp } from '../../_hooks/useEventApp';
import { getAppComponent } from '../../_config/appRegistry';
import { LoadingState, ErrorState } from '../../_components/layout';

export default function EventAppPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;
  const appId = params?.appId as string;

  const { eventData, appData, eventTheme, loading, error, appError } = useEventApp(
    eventId,
    appId
  );

  if (loading) {
    return <LoadingState />;
  }

  const errorMessage = error || appError;
  if (errorMessage || !eventData || !appData) {
    return <ErrorState message={errorMessage ?? undefined} onBack={() => router.back()} />;
  }

  const AppComponent = getAppComponent(appData.type);

  return (
    <AppComponent
      eventId={eventId}
      eventData={eventData}
      appData={appData}
      eventTheme={eventTheme}
    />
  );
}
