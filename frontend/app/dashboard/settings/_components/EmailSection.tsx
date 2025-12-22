'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsCard, SettingsCardEmpty } from './SettingsCard';
import { Input } from '../../_components/form/Input';
import { Button } from '../../_components/Button';
import { Toggle } from '../../_components/form/Toggle';
import { EmailProviderGuide, EmailProviderHelpButton, type EmailProviderConfig } from '@/components/email/EmailProviderGuide';
import { useEmailSettings } from '../_hooks/useEmailSettings';

export function EmailSection() {
  const { t } = useTranslation('dashboard');
  const {
    configuration,
    loading,
    configuring,
    testing,
    error,
    testResult,
    configure,
    remove,
    testConnection,
    clearMessages,
  } = useEmailSettings();

  const [showConfigForm, setShowConfigForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [formData, setFormData] = useState({
    provider: 'gmail' as 'gmail' | 'outlook' | 'custom',
    smtpHost: '',
    smtpPort: 587,
    useSsl: true,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
  });

  useEffect(() => {
    if (configuration) {
      setFormData({
        provider: configuration.provider === 0 ? 'gmail' : configuration.provider === 1 ? 'outlook' : 'custom',
        smtpHost: configuration.smtpHost,
        smtpPort: configuration.smtpPort,
        useSsl: configuration.useSsl,
        username: configuration.username,
        password: '',
        fromEmail: configuration.fromEmail,
        fromName: configuration.fromName,
      });
    }
  }, [configuration]);

  const handleProviderSelect = (config: EmailProviderConfig) => {
    setFormData({
      ...formData,
      provider: config.provider,
      smtpHost: config.host,
      smtpPort: config.port,
      useSsl: config.useSsl,
    });
  };

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    const providerNum = formData.provider === 'gmail' ? 0 : formData.provider === 'outlook' ? 1 : 2;
    const success = await configure({
      provider: providerNum,
      smtpHost: formData.smtpHost,
      smtpPort: formData.smtpPort,
      useSsl: formData.useSsl,
      username: formData.username,
      password: formData.password,
      fromEmail: formData.fromEmail,
      fromName: formData.fromName,
    });
    if (success) {
      setShowConfigForm(false);
    }
  };

  const isFormValid =
    formData.smtpHost.trim() !== '' &&
    formData.smtpPort > 0 &&
    formData.username.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.fromEmail.trim() !== '' &&
    formData.fromName.trim() !== '';

  const icon = (
    <svg className="w-5 h-5 text-nory-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  if (loading) {
    return (
      <div className="bg-nory-card rounded-card p-6 xl:p-7">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-nory-bg rounded w-1/4" />
          <div className="h-4 bg-nory-bg rounded w-1/2" />
          <div className="h-32 bg-nory-bg rounded" />
        </div>
      </div>
    );
  }

  return (
    <SettingsCard
      icon={icon}
      title={t('settings.email.title')}
      description={t('settings.email.subtitle')}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-btn text-red-700 text-body font-grotesk">
          {error}
          <button onClick={clearMessages} className="float-right text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {testResult && (
        <div className={`mb-4 p-3 rounded-btn text-body font-grotesk border-2 ${testResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {testResult.success ? t('settings.email.connectionSuccess') : testResult.error}
          <button onClick={clearMessages} className="float-right opacity-70 hover:opacity-100">×</button>
        </div>
      )}

      {configuration ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-nory-bg rounded-btn">
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.email.providerLabel')}</span>
              <p className="font-medium text-nory-text font-grotesk">
                {configuration.provider === 0 ? 'Gmail' : configuration.provider === 1 ? 'Outlook' : 'SMTP'}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.email.server')}</span>
              <p className="font-medium text-nory-text font-grotesk">{configuration.smtpHost}:{configuration.smtpPort}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.email.fromAddress')}</span>
              <p className="font-medium text-nory-text font-grotesk">{configuration.fromEmail}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.email.fromNameLabel')}</span>
              <p className="font-medium text-nory-text font-grotesk">{configuration.fromName}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.email.lastTest')}</span>
              <p className="font-medium text-nory-text font-grotesk">
                {configuration.lastTestedAt
                  ? new Date(configuration.lastTestedAt).toLocaleString()
                  : t('settings.email.never')}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.email.status')}</span>
              <span className={`inline-block px-2 py-1 rounded-badge text-badge font-medium font-grotesk border-2 ${
                configuration.lastTestSuccessful === true
                  ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                  : configuration.lastTestSuccessful === false
                  ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                  : 'bg-nory-bg text-nory-muted border-nory-border/20'
              }`}>
                {configuration.lastTestSuccessful === true
                  ? t('settings.email.statusWorking')
                  : configuration.lastTestSuccessful === false
                  ? t('settings.email.statusFailed')
                  : t('settings.email.statusNotTested')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={testConnection}
              loading={testing}
              disabled={testing || configuring}
            >
              {t('settings.email.testConnection')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfigForm(true)}
              disabled={testing || configuring}
            >
              {t('settings.email.reconfigure')}
            </Button>
            <Button
              variant="danger"
              onClick={remove}
              loading={configuring}
              disabled={testing || configuring}
            >
              {t('settings.email.remove')}
            </Button>
          </div>
        </div>
      ) : showConfigForm ? (
        <form onSubmit={handleConfigure} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-nory-text font-grotesk">
                {t('settings.email.providerLabel')}
              </label>
              <EmailProviderHelpButton onClick={() => setShowGuide(true)} />
            </div>
            {formData.smtpHost ? (
              <div className={`p-3 rounded-btn border-2 ${
                formData.provider === 'gmail' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                formData.provider === 'outlook' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                'bg-nory-bg border-nory-border/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-nory-text font-grotesk">
                      {formData.provider === 'gmail' ? 'Gmail' :
                       formData.provider === 'outlook' ? 'Outlook' :
                       t('settings.email.customSmtp')}
                    </span>
                    <span className="text-body text-nory-muted font-grotesk">({formData.smtpHost})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuide(true)}
                    className="text-body text-nory-text font-semibold font-grotesk hover:underline"
                  >
                    {t('settings.email.change')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="w-full p-4 border-2 border-dashed border-nory-border/30 rounded-btn text-nory-muted font-grotesk hover:border-nory-border hover:text-nory-text transition-colors"
              >
                {t('settings.email.selectProvider')}
              </button>
            )}
          </div>

          {formData.smtpHost && (
            <>
              {formData.provider === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('settings.email.smtpHostLabel')}
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                    fullWidth
                  />
                  <Input
                    label={t('settings.email.smtpPortLabel')}
                    type="number"
                    value={formData.smtpPort.toString()}
                    onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 587 })}
                    fullWidth
                  />
                </div>
              )}

              <Input
                label={t('settings.email.usernameLabel')}
                type="email"
                placeholder={formData.provider === 'gmail' ? 'din@gmail.com' : 'din@email.com'}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
              />

              <Input
                label={t('settings.email.passwordLabel')}
                type="password"
                placeholder={formData.provider === 'gmail' ? t('settings.email.appPassword') : t('settings.email.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('settings.email.fromEmailLabel')}
                  type="email"
                  placeholder="noreply@example.com"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  fullWidth
                />
                <Input
                  label={t('settings.email.fromNameLabel')}
                  placeholder="Nory"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  fullWidth
                />
              </div>

              {formData.provider === 'custom' && (
                <Toggle
                  label={t('settings.email.useSsl')}
                  checked={formData.useSsl}
                  onChange={(checked) => setFormData({ ...formData, useSsl: checked })}
                />
              )}
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={configuring}
              disabled={!isFormValid || configuring}
            >
              {t('settings.email.save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowConfigForm(false);
                setFormData({
                  provider: 'gmail',
                  smtpHost: '',
                  smtpPort: 587,
                  useSsl: true,
                  username: '',
                  password: '',
                  fromEmail: '',
                  fromName: '',
                });
              }}
              disabled={configuring}
            >
              {t('settings.email.cancel')}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <SettingsCardEmpty
            icon={
              <svg className="w-6 h-6 text-nory-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            message={t('settings.email.notConfigured')}
          />
          <div className="flex justify-center mt-4">
            <Button variant="primary" onClick={() => setShowConfigForm(true)}>
              {t('settings.email.setup')}
            </Button>
          </div>
        </>
      )}

      <EmailProviderGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onSelect={handleProviderSelect}
      />
    </SettingsCard>
  );
}
