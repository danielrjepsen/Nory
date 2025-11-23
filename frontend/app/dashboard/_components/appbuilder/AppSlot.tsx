import React from 'react';
import type { ComponentInstance } from './componentRegistry';

interface AppSlotProps {
  app?: ComponentInstance;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

export function AppSlot({ app, onAddClick, onRemoveClick }: AppSlotProps) {
  if (app) {
    return (
      <div className="relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105">
        <div className="w-14 h-14 bg-white rounded-[14px] flex items-center justify-center text-[1.75rem] shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
          {app.config.meta.icon}
        </div>
        <p className="text-[0.7rem] font-medium text-gray-900 text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap mt-2">
          {app.config.properties.title || app.config.meta.name}
        </p>
        <button
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-sm border-2 border-white flex items-center justify-center transition-all duration-200 hover:bg-red-700"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveClick();
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      className="aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-white transition-all duration-200 hover:scale-105 hover:border-black hover:bg-gray-50"
      onClick={onAddClick}
    >
      <span className="text-gray-300 text-2xl font-light transition-all duration-200 hover:text-black hover:rotate-90">
        +
      </span>
    </div>
  );
}
