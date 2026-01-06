'use client';

import Link from 'next/link';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  href: string;
  variant?: 'sidebar' | 'mobile';
  isBack?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export const NavButton = ({
  icon,
  label,
  isActive,
  href,
  variant = 'sidebar',
  isBack = false,
  collapsed = false,
  onClick,
}: NavButtonProps) => {
  const baseClasses =
    'flex items-center font-medium font-grotesk transition-all duration-150';

  const variantClasses = {
    sidebar: collapsed
      ? 'w-11 h-11 justify-center rounded-btn'
      : 'gap-3 w-full px-4 py-3 xl:px-[1.1rem] xl:py-[0.85rem] 2xl:px-[1.2rem] 2xl:py-[0.9rem] rounded-nav text-nav xl:text-nav-xl 2xl:text-nav-2xl',
    mobile: 'gap-3 px-4 py-3 mb-2 text-base rounded-[10px] w-full',
  };

  const backClasses =
    'text-white/40 dark:text-nory-muted border-2 border-transparent hover:text-white dark:hover:text-nory-text mb-1';

  const getSidebarClasses = () => {
    if (isActive) {
      return collapsed
        ? 'bg-nory-yellow text-nory-black border-2 border-nory-black dark:border-nory-border font-semibold'
        : 'bg-nory-yellow text-nory-black border-2 border-nory-black dark:border-nory-border shadow-brutal dark:shadow-none font-semibold';
    }
    return 'text-white/50 dark:text-nory-muted border-2 border-transparent hover:text-white dark:hover:text-nory-text hover:bg-white/10 dark:hover:bg-nory-bg/50';
  };

  const mobileActiveClasses = isActive
    ? 'bg-nory-yellow text-nory-black border-2 border-nory-border shadow-brutal-sm dark:shadow-none font-semibold'
    : 'text-nory-text/60 border-2 border-transparent hover:bg-nory-yellow/20 hover:text-nory-text';

  const getStateClasses = () => {
    if (isBack) return backClasses;
    return variant === 'sidebar' ? getSidebarClasses() : mobileActiveClasses;
  };

  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${getStateClasses()}`}
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className={`transition-all duration-300 whitespace-nowrap ${
          collapsed && variant === 'sidebar'
            ? 'opacity-0 w-0 overflow-hidden'
            : 'opacity-100'
        }`}
      >
        {label}
      </span>
    </Link>
  );
};
