import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ComponentDefinition } from './componentRegistry';
import { ComponentIcon } from './ComponentIcons';

interface ComponentTypeCardProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onClick: () => void;
}

export function ComponentTypeCard({ component, isSelected, onClick }: ComponentTypeCardProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'guestApp' });

  return (
    <div
      className={`p-4 rounded-btn border-2 cursor-pointer transition-all duration-200 hover:border-nory-border hover:bg-nory-card hover:-translate-y-0.5 hover:shadow-brutal-sm ${
        isSelected
          ? 'border-nory-border bg-nory-card shadow-brutal-sm'
          : 'border-nory-border/30 bg-nory-bg'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-btn flex items-center justify-center border-2 border-nory-border ${
            isSelected ? 'bg-nory-text' : 'bg-nory-card'
          }`}
        >
          <ComponentIcon
            type={component.meta.icon}
            className={`w-5 h-5 ${isSelected ? 'text-nory-card' : 'text-nory-text'}`}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-nory-text font-grotesk mb-0.5">
            {t(`components.${component.id}.name`)}
          </p>
          <p className="text-[0.7rem] text-nory-muted font-grotesk">
            {t(`components.${component.id}.description`)}
          </p>
        </div>
      </div>
    </div>
  );
}
