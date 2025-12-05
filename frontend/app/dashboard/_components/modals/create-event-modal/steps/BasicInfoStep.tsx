'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '../../../form';

interface BasicInfoStepProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoStep({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: BasicInfoStepProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        {t('eventCreation.basicInfo.title')}
      </h2>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed font-normal">
        {t('eventCreation.basicInfo.subtitle')}
      </p>

      <Input
        label={t('eventCreation.basicInfo.eventNameLabel') + ' *'}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={t('eventCreation.basicInfo.eventNamePlaceholder')}
        fullWidth
      />

      <Textarea
        label={t('eventCreation.basicInfo.descriptionLabel')}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder={t('eventCreation.basicInfo.descriptionPlaceholder')}
        rows={4}
        hint={t('eventCreation.basicInfo.descriptionHint')}
        fullWidth
      />
    </div>
  );
}
