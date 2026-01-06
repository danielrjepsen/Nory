import { getApiUrl } from '@/utils/urls';

export interface BackupConfiguration {
  id: string;
  isEnabled: boolean;
  provider: 'None' | 'GoogleDrive';
  schedule: 'Daily' | 'Weekly' | 'Manual';
  folderName: string | null;
  folderId: string | null;
  serviceAccountEmail: string | null;
  lastBackupAt: string | null;
  lastBackupStatus: 'None' | 'InProgress' | 'Success' | 'Failed';
  lastBackupError: string | null;
  totalFilesBackedUp: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackupHistory {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: 'None' | 'InProgress' | 'Success' | 'Failed';
  filesProcessed: number;
  filesUploaded: number;
  filesSkipped: number;
  filesFailed: number;
  totalBytesUploaded: number;
  errorMessage: string | null;
}

export interface TestConnectionResult {
  success: boolean;
  folderId: string | null;
  errorMessage: string | null;
}

export interface BackupRunResult {
  success: boolean;
  filesUploaded: number;
  filesSkipped: number;
  filesFailed: number;
  totalBytesUploaded: number;
  errorMessage: string | null;
}

export async function getBackupConfiguration(): Promise<BackupConfiguration | null> {
  const response = await fetch(`${getApiUrl()}/api/v1/backup/config`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch backup configuration');
  }

  return response.json();
}

export async function configureBackup(
  schedule: 'daily' | 'weekly',
  folderName: string,
  serviceAccountFile: File
): Promise<BackupConfiguration> {
  const formData = new FormData();
  formData.append('Schedule', schedule === 'daily' ? '0' : '1');
  formData.append('FolderName', folderName);
  formData.append('ServiceAccountFile', serviceAccountFile);

  const response = await fetch(`${getApiUrl()}/api/v1/backup/config`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to configure backup');
  }

  return response.json();
}

export async function updateBackupConfiguration(
  schedule?: 'daily' | 'weekly',
  folderName?: string
): Promise<BackupConfiguration> {
  const response = await fetch(`${getApiUrl()}/api/v1/backup/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      schedule: schedule ? (schedule === 'daily' ? 0 : 1) : undefined,
      folderName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update backup configuration');
  }

  return response.json();
}

export async function deleteBackupConfiguration(): Promise<void> {
  const response = await fetch(`${getApiUrl()}/api/v1/backup/config`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete backup configuration');
  }
}

export async function testBackupConnection(): Promise<TestConnectionResult> {
  const response = await fetch(`${getApiUrl()}/api/v1/backup/test`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to test connection');
  }

  return response.json();
}

export async function runBackup(): Promise<BackupRunResult> {
  const response = await fetch(`${getApiUrl()}/api/v1/backup/run`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run backup');
  }

  return response.json();
}

export async function getBackupHistory(limit: number = 10): Promise<BackupHistory[]> {
  const response = await fetch(`${getApiUrl()}/api/v1/backup/history?limit=${limit}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch backup history');
  }

  return response.json();
}
