'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsCard, SettingsCardEmpty } from './SettingsCard';
import { Input } from '../../_components/form/Input';
import { Button } from '../../_components/Button';
import { useBackupSettings } from '../_hooks/useBackupSettings';
import { ServiceAccountGuide, ServiceAccountHelpButton } from '@/components/backup/ServiceAccountGuide';
import type { BackupHistory } from '../../_services/backup';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    None: 'bg-nory-bg text-nory-muted border-nory-border/20',
    InProgress: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    Success: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    Failed: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  };

  return (
    <span className={`inline-block px-2 py-1 rounded-badge text-badge font-medium font-grotesk border-2 ${colors[status] || colors.None}`}>
      {status}
    </span>
  );
}

function HistoryTable({ history }: { history: BackupHistory[] }) {
  const { t } = useTranslation('dashboard');

  if (history.length === 0) {
    return (
      <div className="text-center py-4 text-nory-muted font-grotesk">
        {t('settings.backup.noHistory')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body font-grotesk">
        <thead>
          <tr className="border-b-2 border-nory-border/10">
            <th className="text-left py-2 font-semibold text-nory-muted">{t('settings.backup.history.date')}</th>
            <th className="text-left py-2 font-semibold text-nory-muted">{t('settings.backup.history.status')}</th>
            <th className="text-right py-2 font-semibold text-nory-muted">{t('settings.backup.history.files')}</th>
            <th className="text-right py-2 font-semibold text-nory-muted">{t('settings.backup.history.size')}</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id} className="border-b border-nory-border/30">
              <td className="py-2 text-nory-text">{formatDate(entry.startedAt)}</td>
              <td className="py-2"><StatusBadge status={entry.status} /></td>
              <td className="py-2 text-right text-nory-text">{entry.filesUploaded}/{entry.filesProcessed}</td>
              <td className="py-2 text-right text-nory-text">{formatBytes(entry.totalBytesUploaded)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BackupSection() {
  const { t } = useTranslation('dashboard');
  const {
    configuration,
    history,
    loading,
    configuring,
    testing,
    runningBackup,
    error,
    testResult,
    backupResult,
    configure,
    remove,
    testConnection,
    triggerBackup,
    clearMessages,
  } = useBackupSettings();

  const [showConfigForm, setShowConfigForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [schedule, setSchedule] = useState<'daily' | 'weekly'>('daily');
  const [folderName, setFolderName] = useState('NoryBackup');
  const [serviceAccountFile, setServiceAccountFile] = useState<File | null>(null);

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceAccountFile) return;

    const success = await configure(schedule, folderName, serviceAccountFile);
    if (success) {
      setShowConfigForm(false);
      setServiceAccountFile(null);
    }
  };

  const icon = (
    <svg className="w-5 h-5 text-nory-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
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
      title={t('settings.backup.title')}
      description={t('settings.backup.subtitle')}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-btn text-red-700 text-body font-grotesk">
          {error}
          <button onClick={clearMessages} className="float-right text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {testResult && (
        <div className={`mb-4 p-3 rounded-btn text-body font-grotesk border-2 ${testResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {testResult.success ? t('settings.backup.connectionSuccess') : testResult.errorMessage}
          <button onClick={clearMessages} className="float-right opacity-70 hover:opacity-100">×</button>
        </div>
      )}

      {backupResult && (
        <div className={`mb-4 p-3 rounded-btn text-body font-grotesk border-2 ${backupResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {backupResult.success
            ? t('settings.backup.backupSuccess', { count: backupResult.filesUploaded })
            : backupResult.errorMessage}
          <button onClick={clearMessages} className="float-right opacity-70 hover:opacity-100">×</button>
        </div>
      )}

      {configuration ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-nory-bg rounded-btn">
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.backup.provider')}</span>
              <p className="font-medium text-nory-text font-grotesk">Google Drive</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.backup.schedule')}</span>
              <p className="font-medium text-nory-text font-grotesk">{configuration.schedule === 'Daily' ? t('settings.backup.scheduleDaily') : t('settings.backup.scheduleWeekly')}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.backup.folder')}</span>
              <p className="font-medium text-nory-text font-grotesk">{configuration.folderName}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.backup.lastBackup')}</span>
              <p className="font-medium text-nory-text font-grotesk">
                {configuration.lastBackupAt ? formatDate(configuration.lastBackupAt) : t('settings.backup.never')}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.backup.status')}</span>
              <StatusBadge status={configuration.lastBackupStatus} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-nory-muted font-grotesk">{t('settings.backup.totalFiles')}</span>
              <p className="font-medium text-nory-text font-grotesk">{configuration.totalFilesBackedUp}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={testConnection}
              loading={testing}
              disabled={testing || runningBackup}
            >
              {t('settings.backup.testConnection')}
            </Button>
            <Button
              variant="primary"
              onClick={triggerBackup}
              loading={runningBackup}
              disabled={testing || runningBackup}
            >
              {t('settings.backup.runNow')}
            </Button>
            <Button
              variant="danger"
              onClick={remove}
              loading={configuring}
              disabled={testing || runningBackup || configuring}
            >
              {t('settings.backup.remove')}
            </Button>
          </div>

          {history.length > 0 && (
            <div>
              <h4 className="text-card-title text-nory-text font-grotesk mb-3">{t('settings.backup.history.title')}</h4>
              <HistoryTable history={history} />
            </div>
          )}
        </div>
      ) : showConfigForm ? (
        <form onSubmit={handleConfigure} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-nory-text font-grotesk mb-2">
                {t('settings.backup.scheduleLabel')}
              </label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value as 'daily' | 'weekly')}
                className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-img font-grotesk text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm focus:-translate-x-0.5 focus:-translate-y-0.5"
              >
                <option value="daily">{t('settings.backup.scheduleDaily')}</option>
                <option value="weekly">{t('settings.backup.scheduleWeekly')}</option>
              </select>
            </div>
            <Input
              label={t('settings.backup.folderLabel')}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              fullWidth
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-nory-text font-grotesk">
                {t('settings.backup.serviceAccountLabel')}
              </label>
              <ServiceAccountHelpButton onClick={() => setShowGuide(true)} />
            </div>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setServiceAccountFile(e.target.files?.[0] || null)}
                className="hidden"
                id="backup-service-account"
              />
              <label
                htmlFor="backup-service-account"
                className={`flex items-center justify-center gap-2 w-full py-4 px-4 border-2 border-dashed rounded-btn cursor-pointer transition-colors font-grotesk ${
                  serviceAccountFile
                    ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30'
                    : 'border-nory-border/30 hover:border-nory-border'
                }`}
              >
                {serviceAccountFile ? (
                  <>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 font-medium">{serviceAccountFile.name}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-nory-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-nory-muted">{t('settings.backup.uploadFile')}</span>
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-nory-muted font-grotesk mt-1.5">
              {t('settings.backup.serviceAccountHelp')}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={configuring}
              disabled={!serviceAccountFile || !folderName.trim() || configuring}
            >
              {t('settings.backup.configure')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfigForm(false)}
              disabled={configuring}
            >
              {t('settings.backup.cancel')}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <SettingsCardEmpty
            icon={
              <svg className="w-6 h-6 text-nory-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
            }
            message={t('settings.backup.notConfigured')}
          />
          <div className="flex justify-center mt-4">
            <Button variant="primary" onClick={() => setShowConfigForm(true)}>
              {t('settings.backup.setupBackup')}
            </Button>
          </div>
        </>
      )}

      <ServiceAccountGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </SettingsCard>
  );
}
