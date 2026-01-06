'use client';

import React from 'react';

interface DateTimePickerProps {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  type?: 'datetime' | 'date' | 'time';
  required?: boolean;
  min?: Date;
  max?: Date;
  className?: string;
}

const formatForInput = (date: Date | undefined, type: 'datetime' | 'date' | 'time'): string => {
  if (!date) return '';

  try {
    const isoString = date.toISOString();
    switch (type) {
      case 'datetime':
        return isoString.slice(0, 16);
      case 'date':
        return isoString.slice(0, 10);
      case 'time':
        return isoString.slice(11, 16);
      default:
        return isoString.slice(0, 16);
    }
  } catch {
    return '';
  }
};

const parseFromInput = (value: string, type: 'datetime' | 'date' | 'time'): Date | undefined => {
  if (!value) return undefined;

  try {
    switch (type) {
      case 'datetime':
        return new Date(value);
      case 'date':
        return new Date(`${value}T00:00:00`);
      case 'time':
        return new Date(`1970-01-01T${value}:00`);
      default:
        return new Date(value);
    }
  } catch {
    return undefined;
  }
};

const inputTypes = {
  datetime: 'datetime-local',
  date: 'date',
  time: 'time',
} as const;

export function DateTimePicker({
  id,
  label,
  value,
  onChange,
  type = 'datetime',
  required = false,
  min,
  max,
  className = '',
}: DateTimePickerProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-nory-text mb-1.5 font-grotesk">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={inputTypes[type]}
        value={formatForInput(value, type)}
        onChange={(e) => onChange(parseFromInput(e.target.value, type))}
        min={min ? formatForInput(min, type) : undefined}
        max={max ? formatForInput(max, type) : undefined}
        required={required}
        className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm"
      />
    </div>
  );
}
