'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { componentRegistry } from './componentRegistry';
import { ComponentIcon } from './ComponentIcons';

interface ComponentModalProps {
  isOpen: boolean;
  selectedComponentType: string | null;
  themeColors: { primaryColor: string; secondaryColor: string };
  onClose: () => void;
  onSelectType: (type: string) => void;
  onAdd: () => void;
}

export function ComponentModal({
  isOpen,
  selectedComponentType,
  themeColors,
  onClose,
  onSelectType,
  onAdd,
}: ComponentModalProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'guestApp' });

  if (!isOpen) return null;

  const selectedComponent = selectedComponentType
    ? componentRegistry[selectedComponentType]
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-nory-card border-3 border-nory-border rounded-[24px] shadow-brutal w-full max-w-[950px] max-h-[90vh] overflow-hidden flex flex-col">
        <header className="flex justify-between items-center px-10 py-7 border-b-2 border-nory-border">
          <h2 className="text-[1.4rem] font-bold text-nory-text font-grotesk">
            {t('builder.addComponent')}
          </h2>
          <button
            onClick={onClose}
            className="w-11 h-11 bg-nory-bg border-2 border-nory-border rounded-btn flex items-center justify-center transition-all duration-150 hover:bg-nory-text hover:text-nory-card"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        <div className="grid grid-cols-[1fr_300px] flex-1 overflow-hidden">
          <div className="p-8 overflow-y-auto border-r-2 border-nory-border">
            <div className="mb-6">
              <h3 className="text-[1.25rem] font-bold text-nory-text font-grotesk mb-1">
                {t('modal.selectType')}
              </h3>
              <p className="text-sm text-nory-muted font-grotesk">
                {t('modal.selectTypeDescription')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.values(componentRegistry).map((component) => (
                <button
                  key={component.id}
                  type="button"
                  onClick={() => onSelectType(component.id)}
                  className={`flex items-center gap-4 p-5 bg-nory-card border-2 border-nory-border rounded-[14px] cursor-pointer transition-all duration-150 text-left ${
                    selectedComponentType === component.id
                      ? 'bg-nory-yellow shadow-brutal-sm'
                      : 'hover:bg-nory-bg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm'
                  }`}
                >
                  <div
                    className={`w-12 h-12 border-2 border-nory-border rounded-btn flex items-center justify-center flex-shrink-0 ${
                      selectedComponentType === component.id
                        ? 'bg-nory-card'
                        : 'bg-nory-bg'
                    }`}
                  >
                    <ComponentIcon type={component.meta.icon} className={`w-6 h-6 ${selectedComponentType === component.id ? 'text-nory-black' : 'text-nory-text'}`} />
                  </div>
                  <div className="min-w-0">
                    <span className={`block font-bold text-[0.95rem] font-grotesk ${selectedComponentType === component.id ? 'text-nory-black' : 'text-nory-text'}`}>
                      {t(`components.${component.id}.name`)}
                    </span>
                    <span
                      className={`block text-[0.8rem] font-grotesk truncate ${
                        selectedComponentType === component.id
                          ? 'text-nory-black/70'
                          : 'text-nory-muted'
                      }`}
                    >
                      {t(`components.${component.id}.description`)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-nory-bg p-8 flex flex-col items-center">
            <span className="text-xs font-semibold text-nory-muted uppercase tracking-wider mb-5 font-grotesk">
              {t('modal.preview')}
            </span>

            <div className="bg-nory-text rounded-[32px] p-2.5 w-[200px] shadow-brutal-sm">
              <div
                className="bg-white rounded-[24px] overflow-hidden flex flex-col"
                style={{ aspectRatio: '9/16' }}
              >
                {selectedComponent ? (
                  <>
                    <div
                      className="py-6 px-4 pt-8 text-center"
                      style={{ backgroundColor: themeColors.primaryColor }}
                    >
                      <div className="w-10 h-10 bg-white border-2 border-black rounded-btn mx-auto mb-2 flex items-center justify-center">
                        <ComponentIcon type={selectedComponent.meta.icon} className="w-5 h-5 text-black" />
                      </div>
                      <div className="text-[0.85rem] font-bold text-black font-grotesk">
                        {t(`components.${selectedComponent.id}.name`)}
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-2.5">
                      <div className="h-7 bg-gray-200 rounded-lg" />
                      <div className="h-7 bg-gray-200 rounded-lg w-3/5" />
                      <div className="h-7 bg-gray-200 rounded-lg" />
                      <div className="h-7 bg-gray-200 rounded-lg w-3/5" />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-12 h-12 bg-white border-2 border-dashed border-black/30 rounded-btn flex items-center justify-center mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-black/30">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <line x1="12" y1="8" x2="12" y2="16"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                      </svg>
                    </div>
                    <span className="text-[0.8rem] text-gray-500 font-grotesk">
                      {t('modal.selectPreview')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-4 px-10 py-6 border-t-2 border-nory-border bg-nory-bg">
          <button
            onClick={onClose}
            className="px-6 py-3.5 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-sm font-semibold text-nory-text transition-all duration-150 hover:bg-nory-bg"
          >
            {t('modal.actions.cancel')}
          </button>
          <button
            onClick={onAdd}
            disabled={!selectedComponentType}
            className="flex items-center gap-2 px-7 py-3.5 bg-nory-yellow border-2 border-nory-border rounded-btn font-grotesk text-sm font-bold text-nory-black shadow-brutal-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-brutal-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t('modal.actions.add')}
          </button>
        </footer>
      </div>
    </div>
  );
}
