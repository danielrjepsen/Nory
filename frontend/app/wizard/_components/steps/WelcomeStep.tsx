'use client';

import { useTranslation } from 'react-i18next';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { t } = useTranslation('wizard');

  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-nory-yellow border-2 border-nory-black rounded-2xl flex items-center justify-center shadow-brutal">
        <span className="text-4xl">🎉</span>
      </div>

      <h2 className="text-2xl font-bold text-nory-black mb-3">
        {t('steps.welcome.title')}
      </h2>

      <p className="text-nory-black/60 mb-8 max-w-md mx-auto">
        {t('steps.welcome.description')}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto">
        <div className="flex items-start gap-3 p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
          <div className="w-10 h-10 bg-nory-yellow border-2 border-nory-black rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📸</span>
          </div>
          <div>
            <div className="font-bold text-nory-black text-sm">{t('steps.welcome.features.photos.title')}</div>
            <div className="text-xs text-nory-black/60">{t('steps.welcome.features.photos.description')}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
          <div className="w-10 h-10 bg-nory-yellow border-2 border-nory-black rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">👥</span>
          </div>
          <div>
            <div className="font-bold text-nory-black text-sm">{t('steps.welcome.features.guests.title')}</div>
            <div className="text-xs text-nory-black/60">{t('steps.welcome.features.guests.description')}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
          <div className="w-10 h-10 bg-nory-yellow border-2 border-nory-black rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📱</span>
          </div>
          <div>
            <div className="font-bold text-nory-black text-sm">{t('steps.welcome.features.qr.title')}</div>
            <div className="text-xs text-nory-black/60">{t('steps.welcome.features.qr.description')}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
          <div className="w-10 h-10 bg-nory-yellow border-2 border-nory-black rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <div className="font-bold text-nory-black text-sm">{t('steps.welcome.features.analytics.title')}</div>
            <div className="text-xs text-nory-black/60">{t('steps.welcome.features.analytics.description')}</div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-xs bg-nory-black hover:bg-nory-black/90 text-nory-white font-bold py-3.5 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5"
      >
        {t('steps.welcome.button')}
      </button>
    </div>
  );
}
