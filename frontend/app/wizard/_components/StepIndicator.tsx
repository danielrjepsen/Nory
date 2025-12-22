'use client';

import { useTranslation } from 'react-i18next';
import type { WizardStep } from '../_types';
import { WIZARD_STEPS } from '../_types';

interface StepIndicatorProps {
  currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation('wizard');

  if (currentStep === 'welcome' || currentStep === 'complete') {
    return null;
  }

  const configSteps = WIZARD_STEPS.filter(s => s !== 'welcome' && s !== 'complete');
  const adjustedIndex = configSteps.indexOf(currentStep);

  return (
    <div className="px-8 pt-8 pb-4">
      <div className="flex items-center justify-between">
        {configSteps.map((step, index) => {
          const isActive = index === adjustedIndex;
          const isCompleted = index < adjustedIndex;

          return (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`
                  w-10 h-10 border-2 border-nory-black rounded-xl flex items-center justify-center text-sm font-bold transition-all
                  ${isCompleted ? 'bg-nory-yellow text-nory-black shadow-brutal-sm' : ''}
                  ${isActive ? 'bg-nory-black text-nory-white shadow-brutal-sm' : ''}
                  ${!isActive && !isCompleted ? 'bg-nory-gray text-nory-black/50' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {index < configSteps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 border-t-2 ${
                    index < adjustedIndex ? 'border-nory-yellow' : 'border-nory-black/20'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-3">
        {configSteps.map((step) => (
          <span
            key={step}
            className={`text-xs font-medium ${
              step === currentStep ? 'text-nory-black' : 'text-nory-black/40'
            }`}
          >
            {t(`steps.${step}.label`)}
          </span>
        ))}
      </div>
    </div>
  );
}
