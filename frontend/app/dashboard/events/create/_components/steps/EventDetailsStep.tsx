'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Toggle } from '../../../../_components/form';
import { EventFormData } from '../../../../_hooks/useEventForm';

interface EventDetailsStepProps {
  formData: EventFormData;
  onChange: (field: keyof EventFormData, value: any) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[1.1rem] font-bold text-nory-text font-grotesk mb-5 flex items-center gap-2">
      <span className="w-1 h-5 bg-nory-yellow rounded-sm" />
      {children}
    </h3>
  );
}

const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-[18px] h-[18px] text-nory-text"
  >
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0" />
    <path d="M3.6 9h16.8" />
    <path d="M3.6 15h16.8" />
    <path d="M12 3a17 17 0 0 1 0 18" />
    <path d="M12 3a17 17 0 0 0 0 18" />
  </svg>
);

export function EventDetailsStep({ formData, onChange }: EventDetailsStepProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'eventCreation.details' });
  const [isMultiDay, setIsMultiDay] = useState(!!formData.endDate);

  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;
    return new Date(value);
  };

  return (
    <div className="space-y-4">
      <SectionTitle>{t('sectionTitle')}</SectionTitle>

      <div>
        <label className="block text-[0.8rem] font-semibold text-nory-text mb-1.5 font-grotesk">
          {t('nameLabel')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder={t('namePlaceholder')}
          autoFocus
          className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-[0.9rem] text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm placeholder:text-nory-muted"
        />
      </div>

      <div>
        <label className="block text-[0.8rem] font-semibold text-nory-text mb-1.5 font-grotesk">
          {t('descriptionLabel')}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
          className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-[0.9rem] text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm placeholder:text-nory-muted resize-y min-h-[90px]"
        />
      </div>

      <div>
        <label className="block text-[0.8rem] font-semibold text-nory-text mb-1.5 font-grotesk">
          {t('dateLabel')} <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formatDateForInput(formData.startDate)}
          onChange={(e) => onChange('startDate', parseDateFromInput(e.target.value))}
          className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-[0.9rem] text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm"
        />
        <Checkbox
          checked={isMultiDay}
          onChange={(checked) => {
            setIsMultiDay(checked);
            if (!checked) {
              onChange('endDate', null);
            }
          }}
          label={t('multiDayCheckbox')}
          className="mt-3"
        />
      </div>

      {isMultiDay && (
        <div>
          <label className="block text-[0.8rem] font-semibold text-nory-text mb-1.5 font-grotesk">
            {t('endDateLabel')}
          </label>
          <input
            type="date"
            value={formatDateForInput(formData.endDate)}
            onChange={(e) => onChange('endDate', parseDateFromInput(e.target.value))}
            min={formatDateForInput(formData.startDate)}
            className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-[0.9rem] text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm"
          />
        </div>
      )}

      <Toggle
        label={t('publicEvent')}
        description={t('publicEventDescription')}
        icon={<GlobeIcon />}
        checked={formData.isPublic}
        onChange={(checked) => onChange('isPublic', checked)}
      />
    </div>
  );
}
