import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  noMargin?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  fullWidth = false,
  noMargin = false,
  className = '',
  required,
  ...props
}: TextareaProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${noMargin ? '' : 'mb-4'}`}>
      {label && (
        <label className="block text-sm font-semibold text-nory-text mb-1.5 font-grotesk">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        className={`
          w-full px-4 py-3
          bg-nory-card
          border-2 border-nory-border
          rounded-btn
          font-grotesk
          text-nory-text
          transition-all duration-150
          resize-y min-h-[100px]
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

      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-grotesk">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-sm text-nory-muted font-grotesk">{hint}</p>
      )}
    </div>
  );
}
