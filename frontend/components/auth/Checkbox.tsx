import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 text-[#636e72] cursor-pointer select-none ${className}`}>
      <div
        className={`
          w-5 h-5
          border-2
          rounded
          transition-all duration-200
          flex items-center justify-center
          cursor-pointer
          ${checked
            ? 'bg-[#74b9ff] border-[#74b9ff]'
            : 'bg-white border-[#dee2e6]'
          }
        `}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-white font-bold" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
