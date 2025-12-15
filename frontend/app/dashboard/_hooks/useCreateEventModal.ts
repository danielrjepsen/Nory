import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_contexts/AuthContext';
import { createEvent } from '../_services/events';
import { getThemePresets } from '../_services/themes';
import { INITIAL_FORM_DATA, EVENT_STEPS, type EventFormData } from '../_components/modals/create-event-modal/createEventModalConfig';
import { combineDateAndTime } from '../_utils/dateTimeUtils';
import { getValidationErrorMessage, validateCurrentStep } from '../_components/modals/create-event-modal/eventValidation';
import { Theme } from '../_types/theme';
import { CreateEventRequest } from '../_types';

export function useCreateEventModal(isOpen: boolean) {
  const router = useRouter();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showCustomThemeEditor, setShowCustomThemeEditor] = useState(false);
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);

  // Load themes when modal opens
  useEffect(() => {
    if (isOpen) {
      loadThemes();
    }
  }, [isOpen]);

  const loadThemes = async () => {
    try {
      const fetchedThemes = await getThemePresets();
      setThemes(fetchedThemes);
    } catch (error) {
      console.error('Error loading themes:', error);
    }
  };

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomTheme = () => {
    setShowCustomThemeEditor(true);
  };

  const handleCustomThemeSave = (customTheme: Partial<Theme>) => {
    setFormData(prev => ({
      ...prev,
      selectedTheme: 'custom',
      customTheme
    }));
    setShowCustomThemeEditor(false);
  };

  const canProceed = (): boolean => {
    const currentStep = EVENT_STEPS[activeStep];
    return validateCurrentStep(currentStep, formData);
  };

  const handleNext = () => {
    const currentStep = EVENT_STEPS[activeStep];

    if (!validateCurrentStep(currentStep, formData)) {
      setError(getValidationErrorMessage(currentStep, formData));
      return;
    }

    setError('');
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const startDateTime = combineDateAndTime(formData.startDate, formData.startTime);
      const endDateTime = formData.isMultiDay
        ? combineDateAndTime(formData.endDate, formData.endTime)
        : startDateTime;

      const eventData: CreateEventRequest = {
        name: formData.name,
        description: formData.description,
        startsAt: startDateTime?.toISOString() ?? null,
        endsAt: endDateTime?.toISOString() ?? null,
        isPublic: formData.isPublic,
        themeName: formData.selectedTheme,
        guestAppConfig: formData.guestApp.config,
      };

      const result = await createEvent(eventData);

      resetForm();
      router.push(`/dashboard/events/${result.id}/manage`);
      return result;
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setActiveStep(0);
    setError('');
  };

  return {
    // State
    activeStep,
    loading,
    error,
    themes,
    showCustomThemeEditor,
    formData,

    // Actions
    updateField,
    handleNext,
    handleBack,
    handleSubmit,
    handleCustomTheme,
    handleCustomThemeSave,
    resetForm,
    canProceed,

    // Helpers
    setShowCustomThemeEditor,
  };
}
