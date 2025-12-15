import { useState, useCallback } from 'react';

interface UseStepperOptions {
  totalSteps: number;
  initialStep?: number;
}

export function useStepper({ totalSteps, initialStep = 0 }: UseStepperOptions) {
  const [activeStep, setActiveStep] = useState(initialStep);

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;

  const goToNext = useCallback(() => {
    if (!isLastStep) {
      setActiveStep((prev) => prev + 1);
    }
  }, [isLastStep]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      setActiveStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setActiveStep(step);
    }
  }, [totalSteps]);

  const reset = useCallback(() => {
    setActiveStep(initialStep);
  }, [initialStep]);

  return {
    activeStep,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    goToStep,
    reset,
  };
}
