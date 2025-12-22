import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({
  label,
  error,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block mb-2 text-[#1a1a1a] font-semibold text-sm font-grotesk">
          {label}
        </label>
      )}

      <input
        className={`
          w-full px-4 py-3.5
          border-brutal
          rounded-[10px]
          text-base
          font-grotesk
          bg-[#fffef9]
          text-[#1a1a1a]
          transition-all duration-150
          focus:outline-none
          focus:shadow-brutal-sm
          focus:-translate-x-0.5
          focus:-translate-y-0.5
          disabled:bg-[#f5f5f3] disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 font-grotesk">{error}</p>
      )}
    </div>
  );
}
