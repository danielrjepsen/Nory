'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ThemeSelector from '../../theme/ThemeSelector';
import ThemePreview from '../../theme/ThemePreview';
import CustomThemeEditor from '../../theme/CustomThemeEditor';
import { EventTypeStep, BasicInfoStep, ScheduleStep, SettingsStep, GuestAppStep, ReviewStep } from './steps';
import { useCreateEventModal } from '../../../_hooks/useCreateEventModal';
import { EVENT_STEPS } from './createEventModalConfig';

// TODO: Create StepperModal component
// import { StepperModal } from '../ui';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const { t } = useTranslation('dashboard');
  const {
    activeStep,
    loading,
    error,
    themes,
    showCustomThemeEditor,
    formData,
    updateField,
    handleNext,
    handleBack,
    handleSubmit,
    handleCustomTheme,
    handleCustomThemeSave,
    resetForm,
    canProceed,
    setShowCustomThemeEditor,
  } = useCreateEventModal(isOpen);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModalSubmit = async () => {
    try {
      await handleSubmit();
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <EventTypeStep
            value={formData.eventType}
            onChange={(value) => updateField('eventType', value)}
          />
        );

      case 1:
        return (
          <BasicInfoStep
            name={formData.name}
            description={formData.description}
            onNameChange={(value) => updateField('name', value)}
            onDescriptionChange={(value) => updateField('description', value)}
          />
        );

      case 2:
        return (
          <ScheduleStep
            startDate={formData.startDate}
            onDateSelect={(date) => {
              updateField('startDate', date);
              if (!formData.isMultiDay) {
                updateField('endDate', date);
              }
            }}
            isMultiDay={formData.isMultiDay}
          />
        );

      case 3:
        return (
          <SettingsStep
            isPublic={formData.isPublic}
            onPublicChange={(checked) => updateField('isPublic', checked)}
          />
        );

      case 4:
        return (
          <ThemeSelector
            value={formData.selectedTheme}
            onChange={(theme) => updateField('selectedTheme', theme)}
            columns={1}
            onCustomTheme={handleCustomTheme}
            customThemeData={formData.customTheme}
          />
        );

      case 5:
        return (
          <GuestAppStep
            guestApp={formData.guestApp}
            eventName={formData.name}
            selectedTheme={formData.selectedTheme}
            onChange={(guestApp) => updateField('guestApp', guestApp)}
          />
        );

      case 6:
        return (
          <ReviewStep
            name={formData.name}
            description={formData.description}
            startDate={formData.startDate}
            startTime={formData.startTime}
            isPublic={formData.isPublic}
            selectedTheme={formData.selectedTheme}
            themes={themes}
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const currentStep = EVENT_STEPS[activeStep];
  const shouldShowPreview = currentStep?.showPreview ?? false;
  const modalSize = currentStep?.modalSize ?? 'medium';

  // TODO: Replace with actual StepperModal component when created
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Temporary placeholder - replace with StepperModal */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('eventCreation.modal.title')}</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            {renderStepContent(activeStep)}

            <div className="mt-6 flex justify-between">
              {activeStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={loading}
                >
                  {t('eventCreation.modal.back')}
                </button>
              )}

              {activeStep < EVENT_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
                  disabled={!canProceed() || loading}
                >
                  {t('eventCreation.modal.next')}
                </button>
              ) : (
                <button
                  onClick={handleModalSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
                  disabled={!canProceed() || loading}
                >
                  {loading ? t('eventCreation.modal.creating') : t('eventCreation.modal.submit')}
                </button>
              )}
            </div>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {shouldShowPreview && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6">
          <ThemePreview
            eventName={formData.name}
            eventDescription={formData.description}
            startsAt={formData.startDate ? formData.startDate.toISOString() : ''}
            themeName={formData.selectedTheme}
            customThemeData={formData.customTheme}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      )}

      <CustomThemeEditor
        isOpen={showCustomThemeEditor}
        onClose={() => setShowCustomThemeEditor(false)}
        onSave={handleCustomThemeSave}
        initialTheme={formData.customTheme}
      />
    </>
  );
}
