import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  noMargin?: boolean;
}

export function Input({
  label,
  error,
  hint,
  fullWidth = false,
  icon,
  noMargin = false,
  className = '',
  required,
  ...props
}: InputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${noMargin ? '' : 'mb-4'}`}>
      {label && (
        <label className="block text-sm font-semibold text-nory-text mb-1.5 font-grotesk">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nory-text/50">
            {icon}
          </div>
        )}

        <input
          className={`
            w-full px-4 py-3
            bg-nory-card
            border-2 border-nory-border
            rounded-btn
            font-grotesk
            text-nory-text
            transition-all duration-150
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
            focus:outline-none
            focus:shadow-brutal-sm
            disabled:bg-nory-bg disabled:cursor-not-allowed
            placeholder:text-nory-muted
            ${className}
          `}
          required={required}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-grotesk">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-sm text-nory-muted font-grotesk">{hint}</p>
      )}
    </div>
  );
}
