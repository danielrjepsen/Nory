import React from 'react';
import type { ComponentDefinition } from './componentRegistry';

interface ComponentTypeCardProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onClick: () => void;
}

export function ComponentTypeCard({ component, isSelected, onClick }: ComponentTypeCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-black hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
        isSelected
          ? 'border-black bg-white'
          : 'border-gray-300 bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
            isSelected ? 'bg-black' : 'bg-white'
          }`}
        >
          {component.meta.icon}
        </div>
        <div>
          <p className="text-sm font-semibold mb-0.5">{component.meta.name}</p>
          <p className="text-[0.7rem] text-gray-600">{component.meta.description}</p>
        </div>
      </div>
    </div>
  );
}
