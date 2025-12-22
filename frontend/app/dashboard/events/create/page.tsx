'use client';

import { useState, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../_components/auth/ProtectedRoute';
import PageLayout from '../../_components/layout/PageLayout';
import {
  Alert,
  Card,
  WizardStepper,
  WizardNavigation,
  ExplanationCard,
} from '../../_components';
import { useEventForm, useStepper, type EventFormData } from '../../_hooks';
import { createEvent } from '../../_services/events';

import { EventDetailsStep } from './_components/steps/EventDetailsStep';
import { ThemeStep } from './_components/steps/ThemeStep';
import { GuestAppStep } from './_components/steps/GuestAppStep';
import { ReviewStep } from './_components/steps/ReviewStep';
import { GuestAppPhonePreview } from '../../_components/theme/GuestAppPhonePreview';

interface StepConfig {
  label: string;
  title: string;
  component: ReactNode;
  validate: () => boolean;
  explanation: {
    tag: string;
    title: string;
    description: string;
    previewTitle?: string;
    previewSubtitle?: string;
    previewStats?: { value: string | number; label: string }[];
    features?: { text: string }[];
  };
}

const STEP_COUNT = 4;

function CreateEvent() {
  const router = useRouter();
  const { t } = useTranslation('dashboard', { keyPrefix: 'eventCreation' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, updateField } = useEventForm();
  const {
    activeStep,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    goToStep,
  } = useStepper({ totalSteps: STEP_COUNT });

  const hasRequiredFields = (fields: (keyof EventFormData)[]): boolean => {
    return fields.every((field) => {
      const value = formData[field];
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== undefined && value !== null;
    });
  };

  const getFeatures = (stepKey: string): { text: string }[] => {
    const features = t(`wizard.explanation.${stepKey}.features`, { returnObjects: true });
    if (Array.isArray(features)) {
      return features.map((text: string) => ({ text }));
    }
    return [];
  };

  const stepConfig: StepConfig[] = useMemo(() => [
    {
      label: t('wizard.steps.step1.label'),
      title: t('wizard.steps.step1.title'),
      component: <EventDetailsStep formData={formData} onChange={updateField} />,
      validate: () => hasRequiredFields(['name', 'startDate']),
      explanation: {
        tag: t('wizard.explanation.step1.tag'),
        title: t('wizard.explanation.step1.title'),
        description: t('wizard.explanation.step1.description'),
        previewTitle: formData.name || t('wizard.preview.defaultTitle'),
        previewSubtitle: t('wizard.explanation.step1.previewSubtitle'),
        previewStats: [
          { value: '0', label: t('wizard.preview.photos') },
          { value: '0', label: t('wizard.preview.guests') },
        ],
        features: getFeatures('step1'),
      },
    },
    {
      label: t('wizard.steps.step2.label'),
      title: t('wizard.steps.step2.title'),
      component: (
        <ThemeStep
          value={formData.selectedTheme}
          onChange={(themeName) => updateField('selectedTheme', themeName)}
        />
      ),
      validate: () => formData.selectedTheme.length > 0,
      explanation: {
        tag: t('wizard.explanation.step2.tag'),
        title: t('wizard.explanation.step2.title'),
        description: t('wizard.explanation.step2.description'),
        features: getFeatures('step2'),
      },
    },
    {
      label: t('wizard.steps.step3.label'),
      title: t('wizard.steps.step3.title'),
      component: <GuestAppStep formData={formData} onChange={updateField} />,
      validate: () => true,
      explanation: {
        tag: t('wizard.explanation.step3.tag'),
        title: t('wizard.explanation.step3.title'),
        description: t('wizard.explanation.step3.description'),
        features: getFeatures('step3'),
      },
    },
    {
      label: t('wizard.steps.step4.label'),
      title: t('wizard.steps.step4.title'),
      component: <ReviewStep formData={formData} onEdit={goToStep} />,
      validate: () => hasRequiredFields(['name']),
      explanation: {
        tag: t('wizard.explanation.step4.tag'),
        title: t('wizard.explanation.step4.title'),
        description: t('wizard.explanation.step4.description'),
        features: getFeatures('step4'),
      },
    },
  ], [t, formData, updateField, goToStep]);

  const wizardSteps = stepConfig.map((s) => ({ label: s.label, title: s.title }));
  const currentStep = stepConfig[activeStep];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const createRequest = {
        name: formData.name,
        description: formData.description || undefined,
        startsAt: formData.startDate ? formData.startDate.toISOString() : null,
        endsAt: formData.endDate ? formData.endDate.toISOString() : null,
        isPublic: formData.isPublic,
        themeName: formData.selectedTheme,
        guestAppConfig: formData.guestApp.config,
      };

      await createEvent(createRequest);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as Error)?.message ||
        t('wizard.errors.createFailed');
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <Card>
          <div className="mb-8">
            <WizardStepper
              steps={wizardSteps}
              activeStep={activeStep}
              onStepClick={(index) => index < activeStep && goToStep(index)}
            />
          </div>

          {error && (
            <Alert variant="error" className="mb-6" onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          <div className="min-h-[350px]">{currentStep.component}</div>

          <WizardNavigation
            onBack={goToPrevious}
            onNext={goToNext}
            onCancel={() => router.push('/dashboard')}
            onSubmit={handleSubmit}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            canProceed={currentStep.validate()}
            loading={loading}
          />
        </Card>

        <div className="hidden lg:block space-y-6">
          {activeStep === 1 && (
            <div className="bg-nory-text rounded-card overflow-hidden">
              <GuestAppPhonePreview
                eventName={formData.name}
                themeName={formData.selectedTheme}
              />
            </div>
          )}

          <ExplanationCard
            tag={currentStep.explanation.tag}
            title={currentStep.explanation.title}
            description={currentStep.explanation.description}
            previewTitle={currentStep.explanation.previewTitle}
            previewSubtitle={currentStep.explanation.previewSubtitle}
            previewStats={currentStep.explanation.previewStats}
            features={currentStep.explanation.features}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <CreateEvent />
      </PageLayout>
    </ProtectedRoute>
  );
}
