'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQRCodes } from '../_hooks/useQRCodes';
import { QRCodeCard } from './QRCodeCard';
import { ContentHeader } from '../../_components/ContentHeader';
import { Alert } from '../../_components/Alert';
import { Button } from '../../_components/Button';
import { Heading, Text } from '../../_components/ui/Typography';

export function QRCodesContent() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { events, loading, error, refresh } = useQRCodes();

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

  return (
    <div className="p-6 space-y-6">
      <ContentHeader
        title={t('qrCodes.title')}
        subtitle={t('qrCodes.subtitle')}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
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
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
              />
            </svg>
          </div>
          <Heading as="h3" className="mb-1">
            {t('qrCodes.noEvents')}
          </Heading>
          <Text variant="muted">
            {t('qrCodes.noEventsDescription')}
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <QRCodeCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
