'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGalleries } from '../_hooks/useGalleries';
import { EventSelector } from './EventSelector';
import { PhotoGrid } from '../../_components/PhotoGrid';
import { ContentHeader } from '../../_components/ContentHeader';
import { Alert } from '../../_components/Alert';
import { Button } from '../../_components/Button';
import { StatusBadge } from '../../_components/StatusBadge';
import { Heading, Text } from '../../_components/ui/Typography';
export function GalleriesContent() {
  const { t } = useTranslation(['dashboard', 'common']);
  const {
    events,
    selectedEventId,
    photos,
    loading,
    photosLoading,
    error,
    selectEvent,
    refresh,
  } = useGalleries();

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="error">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={refresh}>
              {t('common:tryAgain')}
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ContentHeader
          title={t('galleries.title')}
          subtitle={t('galleries.subtitle')}
          className="mb-0"
        />
        <EventSelector
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={selectEvent}
          loading={loading}
        />
      </div>

      {selectedEvent && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading as="h3" className="mb-1">
                {selectedEvent.name}
              </Heading>
              <Text variant="muted">
                {selectedEvent.photoCount} {t('galleries.photos')}
              </Text>
            </div>
            <StatusBadge status={selectedEvent.status} />
          </div>

          <PhotoGrid
            photos={photos}
            isLoading={photosLoading}
            skeletonCount={12}
            className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          />
        </div>
      )}

      {!loading && !selectedEventId && events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <Heading as="h3" className="mb-1">
            {t('galleries.noEvents')}
          </Heading>
          <Text variant="muted">
            {t('galleries.noEventsDescription')}
          </Text>
        </div>
      )}
    </div>
  );
}
