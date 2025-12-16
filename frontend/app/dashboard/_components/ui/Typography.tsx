import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  as?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: 'text-3xl font-semibold text-gray-900 mb-4',
  h2: 'text-xl font-semibold text-gray-900 mb-4',
  h3: 'text-lg font-semibold text-gray-900 mb-3',
  h4: 'text-base font-semibold text-gray-900 mb-2',
};

export function Heading({ as: Tag = 'h2', children, className = '' }: HeadingProps) {
  return (
    <Tag className={`${headingStyles[Tag]} ${className}`}>
      {children}
    </Tag>
  );
}

type TextVariant = 'body' | 'small' | 'muted';

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
}

const textStyles: Record<TextVariant, string> = {
  body: 'text-base text-gray-900',
  small: 'text-sm text-gray-700',
  muted: 'text-sm text-gray-500',
};

export function Text({ variant = 'body', children, className = '' }: TextProps) {
  return (
    <p className={`${textStyles[variant]} ${className}`}>
      {children}
    </p>
  );
}

interface LabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Label({ htmlFor, required = false, children, className = '' }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
