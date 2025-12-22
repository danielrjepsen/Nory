'use client';

import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  title: string;
  icon: string;
  eventId?: string;
  showBackButton?: boolean;
  themed?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  rightContent?: React.ReactNode;
}

export function AppHeader({
  title,
  icon,
  eventId,
  showBackButton = true,
  themed = false,
  primaryColor,
  secondaryColor,
  rightContent,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (eventId && typeof window !== 'undefined') {
      sessionStorage.setItem('navigatedFromApp', 'true');
      router.push(`/remote/${eventId}`);
    } else {
      router.back();
    }
  };

  if (themed && primaryColor && secondaryColor) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 px-5 pt-6 pb-5"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-[500px] mx-auto flex items-center justify-between">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all duration-300 bg-white/20 text-white hover:bg-white/30"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div className="text-center flex-1">
            <div className="text-white text-[17px] font-bold tracking-wide mb-0.5">
              {title}
            </div>
          </div>
          {rightContent || <div className="w-[42px]" />}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-6 pb-5 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-[500px] mx-auto flex items-center justify-between">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 shadow-[5px_5px_10px_rgba(0,0,0,0.03),-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#2F4C39] hover:shadow-lg transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <span className="text-[17px] font-semibold tracking-wide bg-gradient-to-br from-[#2F4C39] to-[#4A6B56] bg-clip-text text-transparent">
          {title}
        </span>
        <div className="w-[42px] h-[42px] flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
