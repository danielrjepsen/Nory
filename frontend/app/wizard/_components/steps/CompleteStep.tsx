'use client';

import { useTranslation } from 'react-i18next';

interface CompleteStepProps {
  onFinish: () => void;
}

export function CompleteStep({ onFinish }: CompleteStepProps) {
  const { t } = useTranslation('wizard');

  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-nory-yellow border-2 border-nory-black rounded-2xl flex items-center justify-center shadow-brutal">
        <svg className="w-10 h-10 text-nory-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-nory-black mb-3">
        {t('steps.complete.title')}
      </h2>

      <p className="text-nory-black/60 mb-8 max-w-md mx-auto">
        {t('steps.complete.description')}
      </p>

      <div className="bg-nory-gray border-2 border-nory-black rounded-xl p-6 mb-8 max-w-md mx-auto text-left">
        <h3 className="font-bold text-nory-black mb-4">
          {t('steps.complete.whatsNext.title')}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-nory-yellow border-2 border-nory-black rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-nory-black/80">{t('steps.complete.whatsNext.item1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-nory-yellow border-2 border-nory-black rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-nory-black/80">{t('steps.complete.whatsNext.item2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-nory-yellow border-2 border-nory-black rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-nory-black/80">{t('steps.complete.whatsNext.item3')}</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onFinish}
        className="w-full max-w-xs bg-nory-yellow hover:bg-nory-yellow/90 text-nory-black font-bold py-3.5 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5"
      >
        {t('steps.complete.button')}
      </button>
    </div>
  );
}
