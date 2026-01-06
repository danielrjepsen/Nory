'use client';

import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Checkbox({ checked, onChange, label, size = 'medium', className = '' }: CheckboxProps) {
  const sizeClasses = {
    small: 'w-[18px] h-[18px]',
    medium: 'w-[22px] h-[22px]',
    large: 'w-[26px] h-[26px]',
  };

  const iconSizes = {
    small: 'w-2.5 h-2.5',
    medium: 'w-3.5 h-3.5',
    large: 'w-4 h-4',
  };

  const checkboxElement = (
    <button
      type="button"
      className={`${sizeClasses[size]} rounded-md border-2 border-nory-border flex items-center justify-center transition-colors ${
        checked
          ? 'bg-nory-yellow'
          : 'bg-nory-card hover:bg-nory-bg'
      } ${!label ? className : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className={`${iconSizes[size]} transition-opacity ${checked ? 'opacity-100 text-nory-black' : 'opacity-0'}`}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  );

  if (label) {
    return (
      <label
        className={`flex items-center gap-2.5 cursor-pointer ${className}`}
        onClick={(e) => {
          e.preventDefault();
          onChange?.(!checked);
        }}
      >
        {checkboxElement}
        <span className="text-[0.85rem] font-medium text-nory-text font-grotesk">
          {label}
        </span>
      </label>
    );
  }

  return checkboxElement;
}
