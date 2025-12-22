'use client';

import { useTranslation } from 'react-i18next';
import type { SiteSettings } from '../../_types';

interface SiteSettingsStepProps {
  data: SiteSettings;
  onChange: (data: SiteSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SiteSettingsStep({ data, onChange, onNext, onBack }: SiteSettingsStepProps) {
  const { t } = useTranslation('wizard');

  const handleChange = (field: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  const isValid = data.siteName.trim().length > 0 && data.siteUrl.trim().length > 0;

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center shadow-brutal-sm">
          <span className="text-2xl">🏠</span>
        </div>
        <h2 className="text-xl font-bold text-nory-black mb-2">
          {t('steps.site.title')}
        </h2>
        <p className="text-nory-black/60 text-sm">
          {t('steps.site.description')}
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-bold text-nory-black mb-2">
            {t('steps.site.fields.name.label')}
          </label>
          <input
            type="text"
            placeholder={t('steps.site.fields.name.placeholder')}
            value={data.siteName}
            onChange={handleChange('siteName')}
            className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow focus:border-nory-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-nory-black mb-2">
            {t('steps.site.fields.url.label')}
          </label>
          <input
            type="url"
            placeholder={t('steps.site.fields.url.placeholder')}
            value={data.siteUrl}
            onChange={handleChange('siteUrl')}
            className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow focus:border-nory-black"
          />
          <p className="text-xs text-nory-black/50 mt-2">
            {t('steps.site.fields.url.help')}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-8 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-nory-gray hover:bg-nory-gray/80 text-nory-black font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all"
        >
          {t('buttons.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-nory-black hover:bg-nory-black/90 disabled:bg-nory-black/30 disabled:cursor-not-allowed text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {t('buttons.next')}
        </button>
      </div>
    </div>
  );
}
