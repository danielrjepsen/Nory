import { getApiUrl } from '@/utils/urls';
import type { SetupStatus, SetupData, BackupSettings } from '../_types';

export class SetupAlreadyCompleteError extends Error {
  constructor() {
    super('Setup has already been completed');
    this.name = 'SetupAlreadyCompleteError';
  }
}

export async function getSetupStatus(): Promise<SetupStatus> {
  const response = await fetch(`${getApiUrl()}/api/v1/setup/status`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch setup status');
  }

  return response.json();
}

async function configureBackup(backupSettings: BackupSettings, token: string): Promise<void> {
  if (!backupSettings.serviceAccountFile) {
    throw new Error('Service account file is required');
  }

  const formData = new FormData();
  formData.append('Schedule', backupSettings.schedule === 'daily' ? '0' : '1');
  formData.append('FolderName', backupSettings.folderName);
  formData.append('ServiceAccountFile', backupSettings.serviceAccountFile);

  const response = await fetch(`${getApiUrl()}/api/v1/backup/config`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to configure backup');
  }
}

export async function completeSetup(data: SetupData): Promise<void> {
  const response = await fetch(`${getApiUrl()}/api/v1/setup/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      siteSettings: data.siteSettings,
      adminAccount: data.adminAccount,
      storageSettings: data.storageSettings,
    }),
  });

  if (response.status === 403) {
    throw new SetupAlreadyCompleteError();
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0] || error.error || 'Failed to complete setup');
  }

  if (data.backupSettings?.enabled && data.backupSettings.serviceAccountFile) {
    const result = await response.json();
    if (result.token) {
      await configureBackup(data.backupSettings, result.token);
    }
  }
}
