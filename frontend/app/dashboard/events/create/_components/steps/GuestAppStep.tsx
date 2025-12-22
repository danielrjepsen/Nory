'use client';

import { useTranslation } from 'react-i18next';
import GuestAppBuilder from '../../../../_components/appbuilder/GuestAppBuilder';
import { EventFormData } from '../../../../_hooks/useEventForm';

interface GuestAppStepProps {
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

export function GuestAppStep({ formData, onChange }: GuestAppStepProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'eventCreation.guestApp' });

  const handleGuestAppChange = (guestApp: { config: any; components: any[] }) => {
    onChange('guestApp', guestApp);
  };

  return (
    <div>
      <SectionTitle>{t('title')}</SectionTitle>

      <GuestAppBuilder
        initialConfig={formData.guestApp}
        onConfigChange={handleGuestAppChange}
        eventName={formData.name}
        selectedTheme={formData.selectedTheme}
      />
    </div>
  );
}
