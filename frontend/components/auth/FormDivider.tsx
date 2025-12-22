'use client';

import { useTranslation } from 'react-i18next';

export function FormDivider() {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center my-6 text-[#888] text-[0.85rem] font-medium font-grotesk">
      <div className="flex-1 h-0.5 bg-[#e8e8e6]" />
      <span className="px-4">{t('or')}</span>
      <div className="flex-1 h-0.5 bg-[#e8e8e6]" />
    </div>
  );
}
