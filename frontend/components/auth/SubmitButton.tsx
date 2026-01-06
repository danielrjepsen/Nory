import React from 'react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function SubmitButton({
  loading = false,
  loadingText = 'Loading...',
  children,
  className = '',
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`
        w-full
        bg-[#ffe951]
        text-[#1a1a1a]
        border-brutal
        px-4 py-4
        rounded-[10px]
        text-[1.05rem]
        font-bold
        font-grotesk
        cursor-pointer
        shadow-brutal
        transition-all duration-150
        mb-6
        flex items-center justify-center gap-2
        hover:-translate-x-0.5
        hover:-translate-y-0.5
        hover:shadow-[7px_7px_0_#1a1a1a]
        active:translate-x-0.5
        active:translate-y-0.5
        active:shadow-[2px_2px_0_#1a1a1a]
        disabled:bg-[#e8e8e6]
        disabled:cursor-not-allowed
        disabled:transform-none
        disabled:shadow-brutal
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin" />
      )}
      {loading ? loadingText : children}
    </button>
  );
}
