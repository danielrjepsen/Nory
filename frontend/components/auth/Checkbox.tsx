import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 text-[#1a1a1a] cursor-pointer select-none font-grotesk ${className}`}>
      <div
        className={`
          w-5 h-5
          border-brutal
          rounded-[5px]
          transition-all duration-150
          flex items-center justify-center
          cursor-pointer
          ${checked
            ? 'bg-[#ffe951]'
            : 'bg-[#fffef9]'
          }
        `}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-[#1a1a1a] font-bold" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
}
