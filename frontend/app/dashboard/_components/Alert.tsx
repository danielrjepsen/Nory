'use client';

import React from 'react';
import { ErrorIcon, SuccessIcon, WarningIcon, InfoIcon, CloseIcon } from './icons';

interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const variantStyles = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

const variantIcons = {
  error: ErrorIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function Alert({ variant = 'info', children, className = '', onDismiss }: AlertProps) {
  const Icon = variantIcons[variant];

  return (
    <div className={`p-4 border rounded-lg flex items-start gap-3 ${variantStyles[variant]} ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
