import type { EventFormData, EventStep } from './createEventModalConfig';

export function getValidationErrorMessage(step: EventStep, formData: EventFormData): string {
  switch (step.id) {
    case 'type':
      return 'Please select an event type to continue';
    case 'basic':
      return 'Please enter an event name to continue';
    case 'schedule':
      return 'Please select an event date to continue';
    default:
      return 'Please complete this step to continue';
  }
}

export function validateCurrentStep(step: EventStep, formData: EventFormData): boolean {
  return step.validation?.(formData) ?? false;
}
