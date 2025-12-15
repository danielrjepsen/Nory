'use client';

import React from 'react';
import { useManageEvent, useEventTabs } from '../_hooks';
import { EventHeader } from './EventHeader';
import { EventStats } from './EventStats';
import { EventLinks } from './EventLinks';
import { EventControls } from './EventControls';
import { EventActionTabs } from './EventActionTabs';
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
    copying,
    showEditModal,
    setShowEditModal,
    showGoLiveModal,
    setShowGoLiveModal,
    activeTab,
    copyToClipboard,
    handleEventUpdated,
    handleStatusToggle,
    handleGoLive,
    handleTabChange,
  } = useManageEvent();

  const tabs = useEventTabs({ eventId, event, analytics });

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen relative">
      <EventActionTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="px-6 pb-6 text-center">
        <EventHeader event={event} />
        <EventStats analytics={analytics} event={event} />
        <EventLinks
          guestAppUrl={guestAppUrl}
          slideshowUrl={slideshowUrl}
          copying={copying}
          onCopy={copyToClipboard}
        />
        <EventControls event={event} updating={updating} onStatusToggle={handleStatusToggle} />
      </div>

      <div className="h-8" />

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
    </div>
  );
}