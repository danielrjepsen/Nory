'use client';

import React from 'react';
import { Button } from './Button';

interface StepperNavigationProps {
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  loading?: boolean;
  submitLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  cancelLabel?: string;
}

export function StepperNavigation({
  onBack,
  onNext,
  onCancel,
  onSubmit,
  isFirstStep,
  isLastStep,
  canProceed,
  loading = false,
  submitLabel = 'Submit',
  nextLabel = 'Next',
  backLabel = 'Back',
  cancelLabel = 'Cancel',
}: StepperNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || loading}
      >
        {backLabel}
      </Button>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>

        {isLastStep ? (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={!canProceed}
            loading={loading}
          >
            {submitLabel}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
