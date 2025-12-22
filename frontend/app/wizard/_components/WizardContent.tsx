'use client';

import { useSetupWizard } from '../_hooks/useSetupWizard';
import { WizardLayout } from './WizardLayout';
import { StepIndicator } from './StepIndicator';
import {
  WelcomeStep,
  SiteSettingsStep,
  AdminAccountStep,
  StorageStep,
  EmailStep,
  BackupStep,
  CompleteStep,
} from './steps';

export function WizardContent() {
  const {
    currentStep,
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
    submitSetup,
    submitSetupSkipBackup,
    finishSetup,
    isSubmitting,
    error,
  } = useSetupWizard();

  return (
    <WizardLayout>
      <StepIndicator currentStep={currentStep} />

      {currentStep === 'welcome' && (
        <WelcomeStep onNext={goToNextStep} />
      )}

      {currentStep === 'site' && (
        <SiteSettingsStep
          data={siteSettings}
          onChange={setSiteSettings}
          onNext={goToNextStep}
          onBack={goToPreviousStep}
        />
      )}

      {currentStep === 'admin' && (
        <AdminAccountStep
          data={adminAccount}
          onChange={setAdminAccount}
          onNext={goToNextStep}
          onBack={goToPreviousStep}
        />
      )}

      {currentStep === 'storage' && (
        <StorageStep
          data={storageSettings}
          onChange={setStorageSettings}
          onSubmit={goToNextStep}
          onBack={goToPreviousStep}
          isSubmitting={false}
          error={null}
        />
      )}

      {currentStep === 'email' && (
        <EmailStep
          data={emailSettings}
          onChange={setEmailSettings}
          onNext={goToNextStep}
          onSkip={goToNextStep}
          onBack={goToPreviousStep}
          error={null}
        />
      )}

      {currentStep === 'backup' && (
        <BackupStep
          data={backupSettings}
          onChange={setBackupSettings}
          onSubmit={submitSetup}
          onSkip={submitSetupSkipBackup}
          onBack={goToPreviousStep}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {currentStep === 'complete' && (
        <CompleteStep onFinish={finishSetup} />
      )}
    </WizardLayout>
  );
}
