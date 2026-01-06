'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorIcon, SuccessIcon, WarningIcon, InfoIcon, CloseIcon } from './icons';

interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const variantStyles = {
  error: 'bg-[#fef2f2] text-[#ef4444] dark:bg-red-900/20 dark:text-red-400',
  success: 'bg-[#f0fdf4] text-[#10b981] dark:bg-emerald-900/20 dark:text-emerald-400',
  warning: 'bg-[#fffbeb] text-[#f59e0b] dark:bg-amber-900/20 dark:text-amber-400',
  info: 'bg-[#eff6ff] text-[#3b82f6] dark:bg-blue-900/20 dark:text-blue-400',
};

const variantIcons = {
  error: ErrorIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function Alert({ variant = 'info', children, className = '', onDismiss }: AlertProps) {
  const { t } = useTranslation('common');
  const Icon = variantIcons[variant];

  return (
    <div className={`p-4 border-2 border-nory-border rounded-[10px] flex items-start gap-3 font-grotesk shadow-brutal-sm ${variantStyles[variant]} ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 font-medium">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity p-1 rounded-[6px] hover:bg-nory-text/10"
          aria-label={t('dismiss')}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
