export interface SetupStatus {
  isConfigured: boolean;
  hasAdminUser: boolean;
  databaseConnected: boolean;
  storageConfigured: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
}

export interface AdminAccount {
  name: string;
  email: string;
  password: string;
}

export interface StorageSettings {
  type: 'local' | 's3';
  localPath?: string;
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
}

export interface BackupSettings {
  enabled: boolean;
  provider: 'google-drive' | 'none';
  schedule: 'daily' | 'weekly';
  folderName: string;
  serviceAccountFile: File | null;
}

export interface EmailSettings {
  enabled: boolean;
  provider: 'gmail' | 'outlook' | 'custom';
  smtpHost: string;
  smtpPort: number;
  useSsl: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface SetupData {
  siteSettings: SiteSettings;
  adminAccount: AdminAccount;
  storageSettings: StorageSettings;
  emailSettings?: EmailSettings;
  backupSettings?: BackupSettings;
}

export type WizardStep = 'welcome' | 'site' | 'admin' | 'storage' | 'email' | 'backup' | 'complete';

export const WIZARD_STEPS: WizardStep[] = ['welcome', 'site', 'admin', 'storage', 'email', 'backup', 'complete'];
