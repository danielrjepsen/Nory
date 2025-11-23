import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Checkbox({ checked, onChange, size = 'medium', className = '' }: CheckboxProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      className={`${sizeClasses[size]} rounded border-2 flex items-center justify-center transition-all duration-200 ${
        checked
          ? 'bg-black border-black text-white'
          : 'bg-white border-gray-300 hover:border-gray-400'
      } ${className}`}
      onClick={() => onChange?.(!checked)}
    >
      {checked && (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      )}
    </button>
  );
}
