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
    <div className="mb-6">
      {label && (
        <label className="block mb-2 text-[#2d3436] font-medium text-sm">
          {label}
        </label>
      )}

      <input
        className={`
          w-full px-4 py-3
          border-2 border-[#e9ecef]
          rounded-xl
          text-base
          transition-all duration-300
          bg-white
          text-[#2d3436]
          focus:outline-none
          focus:border-[#74b9ff]
          focus:shadow-[0_0_0_3px_rgba(116,185,255,0.1)]
          focus:-translate-y-0.5
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
