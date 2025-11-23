import React from 'react';

interface ChipProps {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Chip({ label, className = '', style }: ChipProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${className}`} style={style}>
      {label}
    </span>
  );
}
