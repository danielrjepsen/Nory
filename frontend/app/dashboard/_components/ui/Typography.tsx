import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Text({ children, className = '', style }: TypographyProps) {
  return (
    <p className={className} style={style}>
      {children}
    </p>
  );
}

export function Heading({ children, className = '', style }: TypographyProps) {
  return (
    <h3 className={className} style={style}>
      {children}
    </h3>
  );
}
