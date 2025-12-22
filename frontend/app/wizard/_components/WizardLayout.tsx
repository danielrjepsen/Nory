'use client';

import { useTranslation } from 'react-i18next';

interface WizardLayoutProps {
  children: React.ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { t } = useTranslation('wizard');

  return (
    <div className="min-h-screen bg-nory-gray flex items-center justify-center p-4 font-grotesk">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-nory-yellow border-2 border-nory-black rounded-xl p-2 shadow-brutal-sm">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <polygon points="0,0 48,0 48,48 0,48" fill="#1a1a1a"/>
                <polygon points="0,0 48,48 0,48" fill="#ffe951"/>
                <polygon points="52,0 72,0 100,24 72,48 52,48" fill="#1a1a1a"/>
                <polygon points="0,76 28,52 28,100 0,100" fill="#1a1a1a"/>
                <polygon points="52,52 100,52 100,100 52,100" fill="#1a1a1a"/>
                <polygon points="100,52 100,100 52,52" fill="#ffe951"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-nory-black">{t('brand')}</h1>
          </div>
          <p className="text-nory-black/60">{t('tagline')}</p>
        </div>

        <div className="bg-nory-white border-3 border-nory-black rounded-[20px] shadow-brutal overflow-hidden">
          {children}
        </div>

        <p className="text-center text-sm text-nory-black/40 mt-6">
          {t('footer')}
        </p>
      </div>
    </div>
  );
}
