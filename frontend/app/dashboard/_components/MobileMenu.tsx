'use client';

import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavButton } from './NavButton';
import { LogoutIcon } from './icons';
import type { NavigationItem } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  navigationItems: NavigationItem[];
  activeNav: string;
  onNavClick: (item: NavigationItem) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, navigationItems, activeNav, onNavClick, onLogout, onClose }, ref) => {
    const { t } = useTranslation('dashboard');

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="absolute top-20 right-6 z-[99] bg-white/95 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] min-w-[200px]"
      >
        {navigationItems.map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeNav === item.id}
            onClick={() => {
              onNavClick(item);
              onClose();
            }}
            variant="mobile"
          />
        ))}
        <hr className="my-4 border-gray-200" />
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 bg-transparent text-red-600 rounded-xl text-base font-semibold"
        >
          <LogoutIcon />
          {t('user.logout.button')}
        </button>
      </div>
    );
  }
);

MobileMenu.displayName = 'MobileMenu';
