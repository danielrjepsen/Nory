'use client';

interface AppContainerProps {
  children: React.ReactNode;
  className?: string;
  hasHeader?: boolean;
}

export function AppContainer({
  children,
  className = '',
  hasHeader = true,
}: AppContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] to-[#F5F2F0]">
      <div
        className={`max-w-[440px] mx-auto px-5 pb-10 ${
          hasHeader ? 'pt-[110px]' : 'pt-10'
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export default AppContainer;
