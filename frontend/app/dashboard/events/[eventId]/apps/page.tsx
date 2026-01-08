'use client';

import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { updateEvent } from '../../../_services/events';
import { useEvent } from '../../../_hooks';
import GuestAppBuilder from '../../../_components/appbuilder/GuestAppBuilder';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';

function AppsContent() {
  const { event, loading, error, eventId } = useEvent();

  const handleConfigChange = async (config: Record<string, unknown>) => {
    try {
      await updateEvent(eventId, { guestAppConfig: config });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <ErrorState error={error} />;
  }

  return (
    <GuestAppBuilder
      eventName={event.name}
      initialConfig={event.guestAppConfig}
      selectedTheme={event.theme || 'wedding'}
      onConfigChange={handleConfigChange}
    />
  );
}

export default function EventAppsPage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="apps">
        <AppsContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
