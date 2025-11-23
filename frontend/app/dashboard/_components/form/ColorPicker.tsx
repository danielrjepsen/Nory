import React from 'react';

interface ColorPickerProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ label, value = '#3b82f6', onChange, className = '' }: ColorPickerProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
