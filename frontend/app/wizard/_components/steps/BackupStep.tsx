'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceAccountGuide, ServiceAccountHelpButton } from '@/components/backup/ServiceAccountGuide';
import type { BackupSettings } from '../../_types';

interface BackupStepProps {
  data: BackupSettings;
  onChange: (data: BackupSettings) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function BackupStep({ data, onChange, onSubmit, onSkip, onBack, isSubmitting, error }: BackupStepProps) {
  const { t } = useTranslation('wizard');
  const [showGuide, setShowGuide] = useState(false);

  const handleToggleEnabled = () => {
    onChange({ ...data, enabled: !data.enabled });
  };

  const handleScheduleChange = (schedule: 'daily' | 'weekly') => {
    onChange({ ...data, schedule });
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, folderName: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange({ ...data, serviceAccountFile: file });
  };

  const isValid = !data.enabled || (
    data.folderName.trim() !== '' &&
    data.serviceAccountFile !== null
  );

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center shadow-brutal-sm">
          <span className="text-2xl">💾</span>
        </div>
        <h2 className="text-xl font-bold text-nory-black mb-2">
          {t('steps.backup.title')}
        </h2>
        <p className="text-nory-black/60 text-sm">
          {t('steps.backup.description')}
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
            <p className="font-bold text-nory-black">{t('steps.backup.enableBackup')}</p>
            <p className="text-xs text-nory-black/60">{t('steps.backup.enableBackupDescription')}</p>
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
            <div className="p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border-2 border-nory-black bg-nory-yellow flex items-center justify-center">
                  <svg className="w-5 h-5 text-nory-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C6.748 2 2 6.748 2 12.545c0 5.797 4.748 10.545 10.545 10.545 6.072 0 10.091-4.265 10.091-10.273 0-.69-.062-1.353-.183-1.989h-9.908z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-nory-black">{t('steps.backup.provider.googleDrive')}</p>
                  <p className="text-xs text-nory-black/60">{t('steps.backup.provider.googleDriveDescription')}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-nory-black mb-2">
                {t('steps.backup.schedule.label')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleScheduleChange('daily')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    data.schedule === 'daily'
                      ? 'border-nory-black bg-nory-yellow shadow-brutal-sm'
                      : 'border-nory-black/30 hover:border-nory-black bg-nory-white'
                  }`}
                >
                  <span className="font-bold text-nory-black">{t('steps.backup.schedule.daily')}</span>
                  <p className="text-xs mt-1 text-nory-black/60">{t('steps.backup.schedule.dailyDescription')}</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleScheduleChange('weekly')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    data.schedule === 'weekly'
                      ? 'border-nory-black bg-nory-yellow shadow-brutal-sm'
                      : 'border-nory-black/30 hover:border-nory-black bg-nory-white'
                  }`}
                >
                  <span className="font-bold text-nory-black">{t('steps.backup.schedule.weekly')}</span>
                  <p className="text-xs mt-1 text-nory-black/60">{t('steps.backup.schedule.weeklyDescription')}</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-nory-black mb-2">
                {t('steps.backup.folderName.label')}
              </label>
              <input
                type="text"
                placeholder={t('steps.backup.folderName.placeholder')}
                value={data.folderName}
                onChange={handleFolderNameChange}
                className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-nory-black">
                  {t('steps.backup.serviceAccount.label')}
                </label>
                <ServiceAccountHelpButton onClick={() => setShowGuide(true)} />
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                  id="service-account-file"
                />
                <label
                  htmlFor="service-account-file"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    data.serviceAccountFile
                      ? 'border-nory-black bg-nory-yellow'
                      : 'border-nory-black/40 hover:border-nory-black bg-nory-white'
                  }`}
                >
                  {data.serviceAccountFile ? (
                    <>
                      <svg className="w-5 h-5 text-nory-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-nory-black font-bold">{data.serviceAccountFile.name}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-nory-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-nory-black/60">{t('steps.backup.serviceAccount.upload')}</span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-nory-black/50 mt-2">
                {t('steps.backup.serviceAccount.help')}
              </p>
            </div>
          </div>
        )}

        {!data.enabled && (
          <div className="text-center p-4 bg-nory-gray border-2 border-nory-black rounded-xl">
            <p className="text-sm text-nory-black/70">
              {t('steps.backup.skipNotice')}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-nory-gray hover:bg-nory-gray/80 disabled:opacity-50 text-nory-black font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all"
        >
          {t('buttons.back')}
        </button>
        {data.enabled ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1 bg-nory-black hover:bg-nory-black/90 disabled:bg-nory-black/30 disabled:cursor-not-allowed text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-nory-white/30 border-t-nory-white rounded-full animate-spin" />
            )}
            {isSubmitting ? t('buttons.completing') : t('buttons.complete')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="flex-1 bg-nory-black hover:bg-nory-black/90 disabled:bg-nory-black/30 text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-nory-white/30 border-t-nory-white rounded-full animate-spin" />
            )}
            {isSubmitting ? t('buttons.completing') : t('buttons.skipAndComplete')}
          </button>
        )}
      </div>

      <ServiceAccountGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
