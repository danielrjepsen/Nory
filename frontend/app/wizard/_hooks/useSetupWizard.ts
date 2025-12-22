'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SetupData, WizardStep, SiteSettings, AdminAccount, StorageSettings, EmailSettings, BackupSettings } from '../_types';
import { WIZARD_STEPS } from '../_types';
import { completeSetup, SetupAlreadyCompleteError } from '../_services/setupApi';

const initialSiteSettings: SiteSettings = {
  siteName: '',
  siteUrl: typeof window !== 'undefined' ? window.location.origin : '',
};

const initialAdminAccount: AdminAccount = {
  name: '',
  email: '',
  password: '',
};

const initialStorageSettings: StorageSettings = {
  type: 'local',
  localPath: './uploads',
};

const initialEmailSettings: EmailSettings = {
  enabled: false,
  provider: 'gmail',
  smtpHost: '',
  smtpPort: 587,
  useSsl: true,
  username: '',
  password: '',
  fromEmail: '',
  fromName: '',
};

const initialBackupSettings: BackupSettings = {
  enabled: false,
  provider: 'none',
  schedule: 'daily',
  folderName: 'NoryBackup',
  serviceAccountFile: null,
};

export function useSetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [adminAccount, setAdminAccount] = useState<AdminAccount>(initialAdminAccount);
  const [storageSettings, setStorageSettings] = useState<StorageSettings>(initialStorageSettings);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(initialEmailSettings);
  const [backupSettings, setBackupSettings] = useState<BackupSettings>(initialBackupSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep);

  const goToNextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < WIZARD_STEPS.length) {
      setCurrentStep(WIZARD_STEPS[nextIndex]);
      setError(null);
    }
  }, [currentStepIndex]);

  const goToPreviousStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(WIZARD_STEPS[prevIndex]);
      setError(null);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
    setError(null);
  }, []);

  const submitSetup = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data: SetupData = {
        siteSettings,
        adminAccount,
        storageSettings,
        emailSettings: emailSettings.enabled ? emailSettings : undefined,
        backupSettings: backupSettings.enabled ? {
          ...backupSettings,
          provider: 'google-drive',
        } : undefined,
      };

      await completeSetup(data);
      goToNextStep();
    } catch (err) {
      if (err instanceof SetupAlreadyCompleteError) {
        setIsBlocked(true);
        setError('Setup has already been completed. Redirecting...');
        setTimeout(() => router.replace('/dashboard'), 1500);
        return;
      }
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [siteSettings, adminAccount, storageSettings, emailSettings, backupSettings, goToNextStep, router]);

  const submitSetupSkipBackup = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data: SetupData = {
        siteSettings,
        adminAccount,
        storageSettings,
        emailSettings: emailSettings.enabled ? emailSettings : undefined,
      };

      await completeSetup(data);
      goToNextStep();
    } catch (err) {
      if (err instanceof SetupAlreadyCompleteError) {
        setIsBlocked(true);
        setError('Setup has already been completed. Redirecting...');
        setTimeout(() => router.replace('/dashboard'), 1500);
        return;
      }
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [siteSettings, adminAccount, storageSettings, emailSettings, goToNextStep, router]);

  const finishSetup = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps: WIZARD_STEPS.length,
    siteSettings,
    setSiteSettings,
    adminAccount,
    setAdminAccount,
    storageSettings,
    setStorageSettings,
    emailSettings,
    setEmailSettings,
    backupSettings,
    setBackupSettings,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    submitSetup,
    submitSetupSkipBackup,
    finishSetup,
    isSubmitting,
    isBlocked,
    error,
  };
}
