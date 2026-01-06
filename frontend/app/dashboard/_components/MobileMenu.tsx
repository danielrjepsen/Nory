'use client';

import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavButton } from './NavButton';
import { LogoutIcon } from './icons';
import type { NavigationItem } from '../_types';

interface MobileMenuProps {
  isOpen: boolean;
  navigationItems: NavigationItem[];
  activeNav: string;
  onLogout: () => void;
  onClose: () => void;
}

export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, navigationItems, activeNav, onLogout, onClose }, ref) => {
    const { t } = useTranslation('dashboard');

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="absolute top-20 right-6 z-[99] bg-nory-card border-2 border-nory-border rounded-img p-4 shadow-brutal min-w-[200px]"
      >
        {navigationItems.map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeNav === item.id}
            href={item.path}
            onClick={onClose}
            variant="mobile"
          />
        ))}
        <hr className="my-4 border-nory-border/30 border-t-2" />
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 bg-transparent text-red-500 rounded-[8px] text-base font-bold font-grotesk transition-all duration-150 hover:bg-red-500/10"
        >
          <LogoutIcon />
          {t('user.logout.button')}
        </button>
      </div>
    );
  }
);

MobileMenu.displayName = 'MobileMenu';
