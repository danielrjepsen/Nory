'use client';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onBack?: () => void;
}

export function ErrorState({
  title = 'App Not Available',
  message,
  onBack,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-[#F5F2F0] flex items-center justify-center">
      <div className="text-center text-[#2F4C39] max-w-[400px] px-10">
        <div className="text-5xl mb-5">❌</div>
        <h1 className="text-xl mb-3 font-semibold">{title}</h1>
        {message && <p className="text-gray-400 mb-5">{message}</p>}
        {onBack && (
          <button
            onClick={onBack}
            className="bg-gradient-to-br from-white to-gray-100 border-none rounded-xl px-6 py-3 text-[#2F4C39] text-sm cursor-pointer shadow-[5px_5px_10px_rgba(0,0,0,0.03),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-lg transition-shadow"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
