'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { componentRegistry } from './componentRegistry';
import { ComponentTypeCard } from './ComponentTypeCard';
import { ConfigurationForm } from './ConfigurationForm';
import ComponentPreview from './ComponentPreview';

interface ComponentModalProps {
  isOpen: boolean;
  currentStep: number;
  selectedComponentType: string | null;
  componentConfig: any;
  themeColors: { primaryColor: string; secondaryColor: string };
  onClose: () => void;
  onSelectType: (type: string) => void;
  onConfigChange: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  onAdd: () => void;
}

export function ComponentModal({
  isOpen,
  currentStep,
  selectedComponentType,
  componentConfig,
  themeColors,
  onClose,
  onSelectType,
  onConfigChange,
  onNext,
  onBack,
  onAdd,
}: ComponentModalProps) {
  const { t } = useTranslation('dashboard');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.12)] flex">
        <div className="flex-1 p-6 overflow-auto border-r border-gray-200">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'} text-sm font-semibold`}>
                1
              </div>
              <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                <div className={`h-full ${currentStep >= 1 ? 'bg-black' : 'bg-gray-200'} transition-all duration-300`} style={{ width: currentStep >= 1 ? '100%' : '0%' }} />
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'} text-sm font-semibold`}>
                2
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              1
            </div>
            <div>
              <p className={`text-xs font-medium ${currentStep === 0 ? 'text-black' : 'text-gray-400'}`}>
                {t('guestApp.modal.steps.chooseType')}
              </p>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep === 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
            <div>
              <p className={`text-xs font-medium ${currentStep === 1 ? 'text-black' : 'text-gray-400'}`}>
                {t('guestApp.modal.steps.configure')}
              </p>
            </div>
          </div>

          {currentStep === 0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1">{t('guestApp.modal.selectType')}</h2>
                <p className="text-sm text-gray-600">{t('guestApp.modal.selectTypeDescription')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.values(componentRegistry).map((component) => (
                  <ComponentTypeCard
                    key={component.id}
                    component={component}
                    isSelected={selectedComponentType === component.id}
                    onClick={() => onSelectType(component.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && selectedComponentType && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1">{t('guestApp.modal.configureComponent')}</h2>
                <p className="text-sm text-gray-600">{t('guestApp.modal.configureComponentDescription')}</p>
              </div>

              <ConfigurationForm
                properties={componentRegistry[selectedComponentType]?.schema.properties || []}
                config={componentConfig}
                onConfigChange={onConfigChange}
              />
            </div>
          )}
        </div>

        <div className="w-96 bg-gray-50 p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600 mb-4 text-center">{t('guestApp.modal.preview')}</p>
          <div className="w-72 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <div
              className="p-4 text-white text-center"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primaryColor} 0%, ${themeColors.secondaryColor} 100%)`,
              }}
            >
              <p className="text-base mb-1">{t('guestApp.modal.previewTitle')}</p>
              <p className="text-xs opacity-90">{t('guestApp.modal.previewDescription')}</p>
            </div>
            <div className="p-4 min-h-[300px] bg-gray-50">
              {selectedComponentType ? (
                <ComponentPreview componentType={selectedComponentType} config={componentConfig} />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">{t('guestApp.modal.selectPreview')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white rounded-b-2xl flex justify-end gap-3" style={{ width: 'calc(100% - 384px)' }}>
        <button
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          {t('guestApp.modal.actions.cancel')}
        </button>
        {currentStep > 0 && (
          <button
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            onClick={onBack}
          >
            ← {t('guestApp.modal.actions.back')}
          </button>
        )}
        {currentStep === 0 && (
          <button
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onNext}
            disabled={!selectedComponentType}
          >
            {t('guestApp.modal.actions.next')} →
          </button>
        )}
        {currentStep === 1 && (
          <button
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            onClick={onAdd}
          >
            {t('guestApp.modal.actions.add')}
          </button>
        )}
      </div>
    </div>
  );
}
