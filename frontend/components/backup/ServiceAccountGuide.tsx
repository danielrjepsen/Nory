'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ServiceAccountGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    key: 'createProject',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    key: 'enableApi',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: 'createServiceAccount',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    key: 'createKey',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    key: 'downloadKey',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    key: 'shareFolder',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
];

export function ServiceAccountGuide({ isOpen, onClose }: ServiceAccountGuideProps) {
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-card bg-nory-card border-[2.5px] border-nory-border shadow-brutal transition-all">
          <div className="flex items-center justify-between border-b-2 border-nory-border/20 px-4 sm:px-6 py-4">
            <h3 className="text-base sm:text-card-title text-nory-text font-grotesk font-bold">
              {t('serviceAccountGuide.title')}
            </h3>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-btn bg-nory-bg border-2 border-nory-border flex items-center justify-center text-nory-muted hover:bg-nory-yellow hover:text-nory-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 sm:px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((_, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-btn flex items-center justify-center text-[10px] sm:text-xs font-grotesk font-bold transition-colors border-2 ${
                      index === currentStep
                        ? 'bg-nory-yellow border-nory-border text-nory-black'
                        : index < currentStep
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-nory-bg border-nory-border text-nory-muted'
                    }`}
                  >
                    {index < currentStep ? (
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 sm:mx-1.5 ${
                        index < currentStep ? 'bg-green-500' : 'bg-nory-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-nory-bg rounded-btn border-2 border-nory-border flex items-center justify-center text-nory-text">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-grotesk font-semibold text-nory-text mb-2">
                  {t(`serviceAccountGuide.steps.${step.key}.title`)}
                </h4>
                <p className="text-xs sm:text-sm text-nory-muted mb-3">
                  {t(`serviceAccountGuide.steps.${step.key}.description`)}
                </p>
                {step.key === 'createProject' && (
                  <a
                    href="https://console.cloud.google.com/projectcreate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-nory-text hover:text-nory-yellow font-grotesk font-medium transition-colors"
                  >
                    {t('serviceAccountGuide.openConsole')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {step.key === 'enableApi' && (
                  <a
                    href="https://console.cloud.google.com/apis/library/drive.googleapis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-nory-text hover:text-nory-yellow font-grotesk font-medium transition-colors"
                  >
                    {t('serviceAccountGuide.openDriveApi')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {step.key === 'createServiceAccount' && (
                  <a
                    href="https://console.cloud.google.com/iam-admin/serviceaccounts/create"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-nory-text hover:text-nory-yellow font-grotesk font-medium transition-colors"
                  >
                    {t('serviceAccountGuide.createAccount')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {step.key === 'shareFolder' && (
              <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-btn">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-amber-800">
                    {t('serviceAccountGuide.shareTip')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t-2 border-nory-border/20 px-4 sm:px-6 py-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-grotesk font-medium text-nory-muted hover:text-nory-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('serviceAccountGuide.previous')}
            </button>
            <span className="text-xs sm:text-sm text-nory-muted font-grotesk">
              {currentStep + 1} / {STEPS.length}
            </span>
            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleClose}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-grotesk font-bold text-nory-black bg-nory-yellow border-2 border-nory-border rounded-btn shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                {t('serviceAccountGuide.done')}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-grotesk font-bold text-nory-black bg-nory-yellow border-2 border-nory-border rounded-btn shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                {t('serviceAccountGuide.next')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export function ServiceAccountHelpButton({ onClick, className = '' }: HelpButtonProps) {
  const { t } = useTranslation('common');

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm text-nory-text hover:text-nory-yellow font-grotesk font-medium transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {t('serviceAccountGuide.helpButton')}
    </button>
  );
}
