'use client';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading app...' }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-[#F5F2F0] flex items-center justify-center">
      <div className="text-center text-[#2F4C39]">
        <div className="text-4xl mb-4">📱</div>
        <p className="text-base text-gray-400">{message}</p>
      </div>
    </div>
  );
}
