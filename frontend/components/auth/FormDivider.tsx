'use client';

import { useTranslation } from 'react-i18next';

export function FormDivider() {
  const { t } = useTranslation('common');

  return (
    <div className="text-center my-6 relative text-[#636e72] text-sm">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#e9ecef]" />
      <span className="bg-white/95 px-4 relative">{t('or')}</span>
    </div>
  );
}
