'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmailProviderGuide, EmailProviderHelpButton, type EmailProviderConfig } from '@/components/email/EmailProviderGuide';
import type { EmailSettings } from '../../_types';

interface EmailStepProps {
  data: EmailSettings;
  onChange: (data: EmailSettings) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  error: string | null;
}

export function EmailStep({ data, onChange, onNext, onSkip, onBack, error }: EmailStepProps) {
  const { t } = useTranslation('wizard');
  const [showGuide, setShowGuide] = useState(false);

  const handleToggleEnabled = () => {
    onChange({ ...data, enabled: !data.enabled });
  };

  const handleProviderSelect = (config: EmailProviderConfig) => {
    onChange({
      ...data,
      provider: config.provider,
      smtpHost: config.host,
      smtpPort: config.port,
      useSsl: config.useSsl,
    });
  };

  const handleInputChange = (field: keyof EmailSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'smtpPort' ? parseInt(e.target.value) || 587 : e.target.value;
    onChange({ ...data, [field]: value });
  };

  const handleSslToggle = () => {
    onChange({ ...data, useSsl: !data.useSsl });
  };

  const isValid = !data.enabled || (
    data.smtpHost.trim() !== '' &&
    data.smtpPort > 0 &&
    data.username.trim() !== '' &&
    data.password.trim() !== '' &&
    data.fromEmail.trim() !== '' &&
    data.fromName.trim() !== ''
  );

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center shadow-brutal-sm">
          <span className="text-2xl">📧</span>
        </div>
        <h2 className="text-xl font-bold text-nory-black mb-2">
          {t('steps.email.title')}
        </h2>
        <p className="text-nory-black/60 text-sm">
          {t('steps.email.description')}
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
          <div>
            <p className="font-bold text-nory-black">{t('steps.email.enableEmail')}</p>
            <p className="text-xs text-nory-black/60">{t('steps.email.enableEmailDescription')}</p>
          </div>
          <button
            type="button"
            onClick={handleToggleEnabled}
            className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 border-nory-black transition-colors ${
              data.enabled ? 'bg-nory-yellow' : 'bg-nory-white'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-nory-black transition-transform ${
                data.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {data.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-nory-black">
                {t('steps.email.provider.label')}
              </label>
              <EmailProviderHelpButton onClick={() => setShowGuide(true)} />
            </div>

            {data.provider && data.smtpHost && (
              <div className="p-4 rounded-xl border-2 border-nory-black bg-nory-gray">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border-2 border-nory-black bg-nory-yellow flex items-center justify-center">
                    <span className="text-lg">
                      {data.provider === 'gmail' ? '📬' : data.provider === 'outlook' ? '📮' : '✉️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-nory-black">
                      {data.provider === 'gmail' && 'Gmail'}
                      {data.provider === 'outlook' && 'Outlook / Microsoft 365'}
                      {data.provider === 'custom' && t('steps.email.provider.custom')}
                    </p>
                    <p className="text-xs text-nory-black/60">{data.smtpHost}:{data.smtpPort}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuide(true)}
                    className="text-sm text-nory-black font-bold underline"
                  >
                    {t('steps.email.changeProvider')}
                  </button>
                </div>
              </div>
            )}

            {!data.smtpHost && (
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="w-full p-4 border-2 border-dashed border-nory-black/40 rounded-xl text-nory-black/60 hover:border-nory-black hover:text-nory-black transition-colors"
              >
                {t('steps.email.selectProvider')}
              </button>
            )}

            {data.smtpHost && (
              <div className="space-y-4">
                {data.provider === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-nory-black mb-2">
                        {t('steps.email.smtpHost')}
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.example.com"
                        value={data.smtpHost}
                        onChange={handleInputChange('smtpHost')}
                        className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-nory-black mb-2">
                        {t('steps.email.smtpPort')}
                      </label>
                      <input
                        type="number"
                        placeholder="587"
                        value={data.smtpPort.toString()}
                        onChange={handleInputChange('smtpPort')}
                        className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-nory-black mb-2">
                    {t('steps.email.username')}
                  </label>
                  <input
                    type="email"
                    placeholder={data.provider === 'gmail' ? 'din@gmail.com' : 'din@email.com'}
                    value={data.username}
                    onChange={handleInputChange('username')}
                    className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-nory-black mb-2">
                    {t('steps.email.password')}
                  </label>
                  <input
                    type="password"
                    placeholder={data.provider === 'gmail' ? t('steps.email.appPassword') : t('steps.email.passwordPlaceholder')}
                    value={data.password}
                    onChange={handleInputChange('password')}
                    className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-nory-black mb-2">
                      {t('steps.email.fromEmail')}
                    </label>
                    <input
                      type="email"
                      placeholder="noreply@example.com"
                      value={data.fromEmail}
                      onChange={handleInputChange('fromEmail')}
                      className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-nory-black mb-2">
                      {t('steps.email.fromName')}
                    </label>
                    <input
                      type="text"
                      placeholder="Nory"
                      value={data.fromName}
                      onChange={handleInputChange('fromName')}
                      className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
                    />
                  </div>
                </div>

                {data.provider === 'custom' && (
                  <div className="flex items-center justify-between p-3 bg-nory-gray border-2 border-nory-black rounded-xl">
                    <span className="text-sm font-bold text-nory-black">{t('steps.email.useSsl')}</span>
                    <button
                      type="button"
                      onClick={handleSslToggle}
                      className={`relative inline-flex h-6 w-10 items-center rounded-full border-2 border-nory-black transition-colors ${
                        data.useSsl ? 'bg-nory-yellow' : 'bg-nory-white'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-nory-black transition-transform ${
                          data.useSsl ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!data.enabled && (
          <div className="text-center p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
            <p className="text-sm text-nory-black/70">
              {t('steps.email.skipNotice')}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-nory-gray hover:bg-nory-gray/80 text-nory-black font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all"
        >
          {t('buttons.back')}
        </button>
        {data.enabled ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className="flex-1 bg-nory-black hover:bg-nory-black/90 disabled:bg-nory-black/30 disabled:cursor-not-allowed text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0"
          >
            {t('buttons.next')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 bg-nory-black hover:bg-nory-black/90 text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5"
          >
            {t('buttons.skip')}
          </button>
        )}
      </div>

      <EmailProviderGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onSelect={handleProviderSelect}
      />
    </div>
  );
}
