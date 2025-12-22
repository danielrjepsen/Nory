'use client';

import { useTranslation } from 'react-i18next';
import { EventFormData } from '../../../../_hooks/useEventForm';

interface ReviewStepProps {
  formData: EventFormData;
  onEdit: (stepIndex: number) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[1.1rem] font-bold text-nory-text font-grotesk mb-5 flex items-center gap-2">
      <span className="w-1 h-5 bg-nory-yellow rounded-sm" />
      {children}
    </h3>
  );
}

interface ReviewSectionProps {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, editLabel, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="bg-nory-bg rounded-[14px] p-5 border-2 border-transparent hover:border-nory-border transition-all duration-150">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-nory-text font-grotesk">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-[0.8rem] font-semibold text-nory-muted hover:text-nory-text transition-colors font-grotesk"
        >
          {editLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-[0.75rem] text-nory-muted font-grotesk uppercase tracking-wide">{label}</div>
      <div className="text-[0.9rem] font-medium text-nory-text font-grotesk">{value}</div>
    </div>
  );
}

export function ReviewStep({ formData, onEdit }: ReviewStepProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'eventCreation.review' });

  const formatDate = (date: Date | undefined) => {
    if (!date) return t('notSpecified');
    return new Date(date).toLocaleString('da-DK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle>{t('title')}</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReviewSection title={t('eventDetails')} editLabel={t('edit')} onEdit={() => onEdit(0)}>
          <div className="space-y-3">
            <ReviewItem label={t('name')} value={formData.name || t('notSpecified')} />
            {formData.description && (
              <ReviewItem label={t('description')} value={formData.description} />
            )}
            <ReviewItem label={t('startDate')} value={formatDate(formData.startDate)} />
            {formData.endDate && (
              <ReviewItem label={t('endDate')} value={formatDate(formData.endDate)} />
            )}
            <ReviewItem
              label={t('visibility')}
              value={formData.isPublic ? t('publicWithLink') : t('privateInviteOnly')}
            />
          </div>
        </ReviewSection>

        <div className="space-y-4">
          <ReviewSection title={t('theme')} editLabel={t('edit')} onEdit={() => onEdit(1)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-nory-yellow border-2 border-nory-border" />
              <div>
                <div className="text-[0.9rem] font-medium text-nory-text font-grotesk capitalize">
                  {formData.selectedTheme || t('defaultTheme')}
                </div>
                <div className="text-[0.75rem] text-nory-muted font-grotesk">{t('selectedTheme')}</div>
              </div>
            </div>
          </ReviewSection>

          <ReviewSection title={t('guestApp')} editLabel={t('edit')} onEdit={() => onEdit(1)}>
            <div className="text-[0.85rem] text-nory-muted font-grotesk">
              {formData.guestApp.components.length > 0
                ? t('componentsConfigured', { count: formData.guestApp.components.length })
                : t('defaultConfig')}
            </div>
          </ReviewSection>
        </div>
      </div>

      <div className="bg-nory-yellow border-2 border-nory-border rounded-[14px] p-5 shadow-brutal-sm dark:shadow-none">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-nory-black rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-nory-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-nory-black font-grotesk mb-1">{t('readyToCreate')}</div>
            <div className="text-[0.85rem] text-nory-black/70 font-grotesk">
              {t('readyToCreateDescription')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
