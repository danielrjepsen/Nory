import React from 'react';
import type { ComponentInstance } from './componentRegistry';
import { ComponentIcon } from './ComponentIcons';

interface AppSlotProps {
  app?: ComponentInstance;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

export function AppSlot({ app, onAddClick, onRemoveClick }: AppSlotProps) {
  if (app) {
    return (
      <div className="relative aspect-square flex flex-col items-center justify-center rounded-btn cursor-pointer transition-all duration-200 hover:scale-105">
        <div className="w-14 h-14 bg-nory-card rounded-btn border-2 border-nory-border flex items-center justify-center shadow-brutal-sm transition-all duration-200 hover:scale-110 hover:-translate-y-0.5">
          <ComponentIcon type={app.config.meta.icon} className="w-7 h-7 text-nory-text" />
        </div>
        <p className="text-[0.7rem] font-semibold text-nory-text font-grotesk text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap mt-2">
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
      className="aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer rounded-btn border-2 border-dashed border-nory-border/30 bg-nory-card transition-all duration-200 hover:scale-105 hover:border-nory-border hover:bg-nory-bg"
      onClick={onAddClick}
    >
      <span className="text-nory-muted text-2xl font-light transition-all duration-200 group-hover:text-nory-text group-hover:rotate-90">
        +
      </span>
    </div>
  );
}
