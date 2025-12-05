'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import SelectionCard from '@/app/dashboard/_components/ui/SelectionCard';

interface EventTypeStepProps {
  value: 'single' | 'organizer' | '';
  onChange: (value: string) => void;
}

export function EventTypeStep({ value, onChange }: EventTypeStepProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        {t('eventCreation.eventType.title')}
      </h2>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed font-normal">
        {t('eventCreation.eventType.subtitle')}
      </p>

      <SelectionCard
        options={[
          {
            id: 'single',
            icon: '🎉',
            title: t('eventCreation.eventType.singleEvent.title'),
            description: t('eventCreation.eventType.singleEvent.description'),
            gradient: { from: '#EC4899', to: '#C9B6E4' },
          },
          {
            id: 'organizer',
            icon: '🚀',
            title: t('eventCreation.eventType.eventOrganizer.title'),
            description: t('eventCreation.eventType.eventOrganizer.description'),
            gradient: { from: '#EC4899', to: '#C9B6E4' },
          },
        ]}
        value={value}
        onChange={onChange}
        columns={1}
        cardStyle="elevated"
        size="medium"
      />
    </div>
  );
}
