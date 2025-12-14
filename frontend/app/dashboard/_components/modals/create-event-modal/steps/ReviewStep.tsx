'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, setMinutes, setHours } from 'date-fns';
import { Theme } from '@/app/dashboard/_types/theme';

interface ReviewStepProps {
  name: string;
  description: string;
  startDate: Date | undefined;
  startTime: string;
  isPublic: boolean;
  selectedTheme: string;
  themes: Theme[];
}

export function ReviewStep({
  name,
  description,
  startDate,
  startTime,
  isPublic,
  selectedTheme,
  themes,
}: ReviewStepProps) {
  const { t } = useTranslation('dashboard');

  const combineDateAndTime = (date: Date | undefined, time: string): Date | null => {
    if (!date) return null;
    const [hours, minutes] = time.split(':').map(Number);
    return setMinutes(setHours(date, hours), minutes);
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('eventCreation.review.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('eventCreation.review.subtitle')}
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <span className="text-sm text-gray-500 font-medium">{t('eventCreation.review.name')}</span>
            <span className="text-sm text-gray-900 ml-2">
              {name || t('eventCreation.review.defaultName')}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-500 font-medium">{t('eventCreation.review.description')}</span>
            <span className="text-sm text-gray-900 ml-2">
              {description || t('eventCreation.review.noDescription')}
            </span>
          </div>

          {startDate && (
            <div>
              <span className="text-sm text-gray-500 font-medium">{t('eventCreation.review.start')}</span>
              <span className="text-sm text-gray-900 ml-2">
                {format(
                  combineDateAndTime(startDate, startTime) || new Date(),
                  'PPpp'
                )}
              </span>
            </div>
          )}

          <div>
            <span className="text-sm text-gray-500 font-medium">{t('eventCreation.review.visibility')}</span>
            <span className="text-sm text-gray-900 ml-2">
              {isPublic ? t('eventCreation.review.public') : t('eventCreation.review.private')}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-500 font-medium">{t('eventCreation.review.theme')}</span>
            <span className="text-sm text-gray-900 ml-2">
              {themes.find((theme) => theme.name === selectedTheme)?.displayName || 'Wedding'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
