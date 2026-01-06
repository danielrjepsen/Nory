'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type EmailProvider = 'gmail' | 'outlook' | 'custom';

export interface EmailProviderConfig {
  provider: EmailProvider;
  host: string;
  port: number;
  useSsl: boolean;
}

interface EmailProviderGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (config: EmailProviderConfig) => void;
}

const PROVIDERS: { key: EmailProvider; host: string; port: number; useSsl: boolean }[] = [
  { key: 'gmail', host: 'smtp.gmail.com', port: 587, useSsl: true },
  { key: 'outlook', host: 'smtp.office365.com', port: 587, useSsl: true },
  { key: 'custom', host: '', port: 587, useSsl: true },
];

const GMAIL_STEPS = [
  'enableTwoFactor',
  'generateAppPassword',
  'copyPassword',
];

const OUTLOOK_STEPS = [
  'signIn',
  'useEmailAsUsername',
  'useRegularPassword',
];

export function EmailProviderGuide({ isOpen, onClose, onSelect }: EmailProviderGuideProps) {
  const { t } = useTranslation('common');
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleSelectProvider = (provider: EmailProvider) => {
    setSelectedProvider(provider);
    setCurrentStep(0);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setSelectedProvider(null);
    }
  };

  const handleNext = () => {
    const steps = selectedProvider === 'gmail' ? GMAIL_STEPS : OUTLOOK_STEPS;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    const config = PROVIDERS.find(p => p.key === selectedProvider);
    if (config) {
      onSelect({
        provider: config.key,
        host: config.host,
        port: config.port,
        useSsl: config.useSsl,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedProvider(null);
    setCurrentStep(0);
    onClose();
  };

  const renderProviderSelection = () => (
    <div className="px-6 py-6 space-y-3">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.key}
          onClick={() => handleSelectProvider(provider.key)}
          className="w-full flex items-center gap-4 p-4 rounded-btn border-2 border-nory-border bg-nory-bg hover:border-nory-yellow hover:bg-nory-yellow/10 transition-all text-left"
        >
          <div className={`w-12 h-12 rounded-btn flex items-center justify-center border-2 border-nory-border ${
            provider.key === 'gmail' ? 'bg-red-50' :
            provider.key === 'outlook' ? 'bg-blue-50' : 'bg-nory-bg'
          }`}>
            {provider.key === 'gmail' && (
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
            )}
            {provider.key === 'outlook' && (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.178c.103.075.223.113.36.113.135 0 .255-.038.357-.113l6.84-5.131c.098-.072.152-.15.162-.236.01-.085-.017-.15-.079-.202-.062-.052-.147-.078-.256-.078h-.024-.012l-.036.006-.037.012-.024.012-.012.006-7.05 5.256c-.213.16-.48.24-.8.24-.321 0-.594-.08-.82-.24L7.36 7.182 6.82 7.6V2.52c0-.227.08-.42.238-.577.158-.156.35-.234.578-.234h15.728c.228 0 .422.078.58.234.158.156.238.35.238.577l.002 4.868-.002-.001zM14.634 18.67v-6.07l.006-.012v.012l-.006 6.07zm-8.18 2.8c.16 0 .313-.032.463-.097.15-.064.275-.148.38-.25.103-.103.185-.228.244-.375.06-.148.09-.302.09-.463V7.057c0-.322-.11-.598-.334-.827-.222-.23-.495-.344-.82-.344H.822c-.16 0-.312.033-.457.098-.144.066-.27.15-.375.254-.105.104-.19.228-.25.373-.06.146-.09.3-.09.457v13.2c0 .323.113.598.338.828.226.23.498.344.817.344h5.65zm-2.63-3.57c-.68 0-1.247-.222-1.697-.668-.45-.447-.675-1.018-.675-1.712 0-.695.225-1.266.675-1.712.45-.447 1.017-.67 1.697-.67.68 0 1.247.223 1.697.67.45.446.675 1.017.675 1.712 0 .694-.225 1.265-.675 1.712-.45.446-1.017.668-1.697.668z"/>
              </svg>
            )}
            {provider.key === 'custom' && (
              <svg className="w-6 h-6 text-nory-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-grotesk font-semibold text-nory-text">
              {t(`emailProviderGuide.providers.${provider.key}.name`)}
            </h4>
            <p className="text-sm text-nory-muted">
              {t(`emailProviderGuide.providers.${provider.key}.description`)}
            </p>
          </div>
          <svg className="w-5 h-5 text-nory-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  );

  const renderGmailGuide = () => {
    const step = GMAIL_STEPS[currentStep];
    return (
      <div className="px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          {GMAIL_STEPS.map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-btn flex items-center justify-center text-xs sm:text-sm font-grotesk font-bold transition-colors border-2 ${
                  index === currentStep
                    ? 'bg-nory-yellow border-nory-border text-nory-black'
                    : index < currentStep
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-nory-bg border-nory-border text-nory-muted'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < GMAIL_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 sm:mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-nory-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-red-50 rounded-btn border-2 border-red-200 p-4 mb-4">
          <h4 className="font-grotesk font-semibold text-red-800 mb-2 text-sm sm:text-base">
            {t(`emailProviderGuide.gmail.steps.${step}.title`)}
          </h4>
          <p className="text-xs sm:text-sm text-red-700">
            {t(`emailProviderGuide.gmail.steps.${step}.description`)}
          </p>
        </div>

        {step === 'enableTwoFactor' && (
          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-grotesk font-medium"
          >
            {t('emailProviderGuide.gmail.openSecurity')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {step === 'generateAppPassword' && (
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-grotesk font-medium"
          >
            {t('emailProviderGuide.gmail.openAppPasswords')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        {step === 'copyPassword' && (
          <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-btn">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs sm:text-sm text-amber-800">
                {t('emailProviderGuide.gmail.passwordTip')}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOutlookGuide = () => {
    const step = OUTLOOK_STEPS[currentStep];
    return (
      <div className="px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          {OUTLOOK_STEPS.map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-btn flex items-center justify-center text-xs sm:text-sm font-grotesk font-bold transition-colors border-2 ${
                  index === currentStep
                    ? 'bg-nory-yellow border-nory-border text-nory-black'
                    : index < currentStep
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-nory-bg border-nory-border text-nory-muted'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < OUTLOOK_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 sm:mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-nory-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-btn border-2 border-blue-200 p-4 mb-4">
          <h4 className="font-grotesk font-semibold text-blue-800 mb-2 text-sm sm:text-base">
            {t(`emailProviderGuide.outlook.steps.${step}.title`)}
          </h4>
          <p className="text-xs sm:text-sm text-blue-700">
            {t(`emailProviderGuide.outlook.steps.${step}.description`)}
          </p>
        </div>

        {step === 'signIn' && (
          <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-btn">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>{t('emailProviderGuide.outlook.smtpSettings')}</strong><br />
              {t('emailProviderGuide.outlook.host')}: smtp.office365.com<br />
              {t('emailProviderGuide.outlook.port')}: 587
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCustomGuide = () => (
    <div className="px-4 sm:px-6 py-6">
      <div className="bg-nory-bg rounded-btn border-2 border-nory-border p-4 mb-4">
        <h4 className="font-grotesk font-semibold text-nory-text mb-2 text-sm sm:text-base">
          {t('emailProviderGuide.custom.title')}
        </h4>
        <p className="text-xs sm:text-sm text-nory-muted">
          {t('emailProviderGuide.custom.description')}
        </p>
      </div>
      <div className="space-y-2 text-xs sm:text-sm text-nory-muted">
        <p><strong className="text-nory-text">{t('emailProviderGuide.custom.requiredInfo')}:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{t('emailProviderGuide.custom.smtpHost')}</li>
          <li>{t('emailProviderGuide.custom.smtpPort')}</li>
          <li>{t('emailProviderGuide.custom.username')}</li>
          <li>{t('emailProviderGuide.custom.password')}</li>
        </ul>
      </div>
    </div>
  );

  const steps = selectedProvider === 'gmail' ? GMAIL_STEPS : selectedProvider === 'outlook' ? OUTLOOK_STEPS : [];
  const isLastStep = selectedProvider === 'custom' || currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-card bg-nory-card border-[2.5px] border-nory-border shadow-brutal transition-all">
          <div className="flex items-center justify-between border-b-2 border-nory-border/20 px-6 py-4">
            <h3 className="text-card-title text-nory-text font-grotesk">
              {selectedProvider
                ? t(`emailProviderGuide.providers.${selectedProvider}.name`)
                : t('emailProviderGuide.title')}
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

          {!selectedProvider && renderProviderSelection()}
          {selectedProvider === 'gmail' && renderGmailGuide()}
          {selectedProvider === 'outlook' && renderOutlookGuide()}
          {selectedProvider === 'custom' && renderCustomGuide()}

          {selectedProvider && (
            <div className="flex items-center justify-between border-t-2 border-nory-border/20 px-4 sm:px-6 py-4">
              <button
                onClick={handleBack}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-grotesk font-medium text-nory-muted hover:text-nory-text transition-colors"
              >
                {t('emailProviderGuide.back')}
              </button>
              {selectedProvider !== 'custom' && !isLastStep && (
                <span className="text-xs sm:text-sm text-nory-muted font-grotesk">
                  {currentStep + 1} / {steps.length}
                </span>
              )}
              {isLastStep ? (
                <button
                  onClick={handleComplete}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-grotesk font-bold text-nory-black bg-nory-yellow border-2 border-nory-border rounded-btn shadow-brutal-sm hover:shadow-brutal transition-all"
                >
                  {t('emailProviderGuide.useThisProvider')}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-grotesk font-bold text-nory-black bg-nory-yellow border-2 border-nory-border rounded-btn shadow-brutal-sm hover:shadow-brutal transition-all"
                >
                  {t('emailProviderGuide.next')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export function EmailProviderHelpButton({ onClick, className = '' }: HelpButtonProps) {
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
      {t('emailProviderGuide.helpButton')}
    </button>
  );
}
