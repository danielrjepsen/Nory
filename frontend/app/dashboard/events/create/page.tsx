'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../_components/auth/ProtectedRoute';
import PageLayout from '../../_components/layout/PageLayout';
import {
  ContentCard,
  ContentHeader,
  Stepper,
  StepperNavigation,
  Alert,
} from '../../_components';
import { useEventForm, useStepper, type EventFormData } from '../../_hooks';
import { createEvent } from '../../_services/events';

import { EventDetailsStep } from './_components/steps/EventDetailsStep';
import { GuestAppStep } from './_components/steps/GuestAppStep';
import { ReviewStep } from './_components/steps/ReviewStep';

interface StepConfig {
  label: string;
  component: ReactNode;
  validate: () => boolean;
}

const STEP_COUNT = 3;

function CreateEvent() {
  const router = useRouter();
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

  const stepConfig: StepConfig[] = [
    {
      label: 'Event Details',
      component: <EventDetailsStep formData={formData} onChange={updateField} />,
      validate: () => hasRequiredFields(['name', 'startDate']),
    },
    {
      label: 'Guest App',
      component: <GuestAppStep formData={formData} onChange={updateField} />,
      validate: () => true,
    },
    {
      label: 'Review & Create',
      component: <ReviewStep formData={formData} onEdit={goToStep} />,
      validate: () => hasRequiredFields(['name']),
    },
  ];

  const stepLabels = stepConfig.map((s) => s.label);

  const currentStep = stepConfig[activeStep];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate start date is not in the past
      if (formData.startDate && formData.startDate < new Date()) {
        setError('Start date cannot be in the past');
        setLoading(false);
        return;
      }

      const createRequest = {
        name: formData.name,
        description: formData.description || undefined,
        // Convert dates to ISO strings for proper timezone handling
        startsAt: formData.startDate ? formData.startDate.toISOString() : null,
        endsAt: formData.endDate ? formData.endDate.toISOString() : null,
        isPublic: formData.isPublic,
        themeName: formData.selectedTheme,
        guestAppConfig: formData.guestApp.config,
      };

      await createEvent(createRequest);
      router.push('/dashboard');
    } catch (err: any) {
      // Handle validation errors from backend
      const message = err?.data?.message || err?.message || 'Failed to create event';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <ContentCard maxWidth="4xl">
      <ContentHeader
        title="Create New Event"
        subtitle="Set up your event in just a few steps"
      />

      <div className="mb-8">
        <Stepper
          steps={stepLabels}
          activeStep={activeStep}
          onStepClick={(index) => index < activeStep && goToStep(index)}
        />
      </div>

      {error && (
        <Alert variant="error" className="mb-6" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="min-h-[400px] mb-8">
        {currentStep.component}
      </div>

      <StepperNavigation
        onBack={goToPrevious}
        onNext={goToNext}
        onCancel={() => router.push('/dashboard')}
        onSubmit={handleSubmit}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={currentStep.validate()}
        loading={loading}
        submitLabel="Create Event"
      />
    </ContentCard>
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
