'use client';

import React from 'react';
import { useManageEvent } from '../_hooks';
import { EventOverviewHeader } from './EventOverviewHeader';
import { EventStatsRow } from './EventStatsRow';
import { QuickActionsCard } from './QuickActionsCard';
import { RecentPhotosCard } from './RecentPhotosCard';
import { EventActivityFeed } from './EventActivityFeed';
import { QRCodeCard } from './QRCodeCard';
import { EventLinksCard } from './EventLinksCard';
import { GuestsPreviewCard } from './GuestsPreviewCard';
import { EditEventModal } from './EditEventModal';
import { GoLiveConfirmModal } from './GoLiveConfirmModal';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export function ManageEventContent() {
  const {
    event,
    analytics,
    eventId,
    guestAppUrl,
    slideshowUrl,
    loading,
    updating,
    error,
    showEditModal,
    setShowEditModal,
    showGoLiveModal,
    setShowGoLiveModal,
    handleEventUpdated,
    handleGoLive,
  } = useManageEvent();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <ErrorState error={error} />;
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <EventOverviewHeader event={event} guestAppUrl={guestAppUrl} onPublish={() => setShowGoLiveModal(true)} />
        <EventStatsRow event={event} analytics={analytics} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <div className="flex flex-col gap-4">
            <QuickActionsCard eventId={eventId} />
            <RecentPhotosCard
              eventId={eventId}
              totalPhotoCount={analytics.photoCount}
            />
            <EventActivityFeed eventId={eventId} />
          </div>

          <div className="flex flex-col gap-4 xl:grid xl:grid-cols-1">
            <QRCodeCard
              eventName={event.name}
              guestAppUrl={guestAppUrl}
            />
            <EventLinksCard
              guestAppUrl={guestAppUrl}
              slideshowUrl={slideshowUrl}
              eventStatus={event.status}
            />
            <GuestsPreviewCard
              eventId={eventId}
              totalGuestCount={analytics.guestCount}
            />
          </div>
        </div>
      </div>

      <EditEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        event={event}
        onEventUpdated={handleEventUpdated}
      />

      <GoLiveConfirmModal
        isOpen={showGoLiveModal}
        onClose={() => setShowGoLiveModal(false)}
        onConfirm={handleGoLive}
        event={event}
        loading={updating}
      />
    </>
  );
}
