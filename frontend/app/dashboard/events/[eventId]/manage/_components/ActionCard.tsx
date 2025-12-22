'use client';

import React from 'react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function ActionCard({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: ActionCardProps) {
  return (
    <div className="flex items-center gap-4 p-5 xl:p-6 bg-nory-card rounded-card">
      <div className="w-11 h-11 bg-nory-bg rounded-btn flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-card-title xl:text-card-title-xl text-nory-text font-grotesk">
          {title}
        </div>
        <div className="text-body xl:text-body-xl text-nory-muted font-grotesk">
          {description}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-4 py-2.5 bg-nory-card text-nory-text border-2 border-nory-border rounded-[8px] text-btn font-semibold font-grotesk transition-colors hover:bg-nory-bg"
          >
            {secondaryAction.label}
          </button>
        )}
        <button
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          className="px-4 py-2.5 bg-nory-yellow text-nory-black border-2 border-nory-border rounded-[8px] text-btn font-grotesk shadow-brutal-sm transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
        >
          {primaryAction.label}
        </button>
      </div>
    </div>
  );
}
