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
        bg-[#2d3436]
        text-white
        border-none
        px-5 py-4
        rounded-xl
        text-base
        font-semibold
        cursor-pointer
        transition-all duration-300
        mb-6
        relative
        overflow-hidden
        flex items-center justify-center gap-2
        hover:bg-[#636e72]
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(45,52,54,0.4)]
        active:-translate-y-0.5
        disabled:bg-[#9ca3af]
        disabled:cursor-not-allowed
        disabled:transform-none
        disabled:shadow-none
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {loading ? loadingText : children}
    </button>
  );
}
