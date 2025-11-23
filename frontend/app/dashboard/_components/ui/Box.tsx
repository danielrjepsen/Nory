import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Box({ children, className = '', style, onClick }: BoxProps) {
  return (
    <div className={className} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
