'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../_contexts/AuthContext';
import { MobileMenu } from '../MobileMenu';
import { MenuIcon, PlusIcon } from '../icons';
import { usePageTitle, useClickOutside, useNavigationItems } from '@/app/dashboard/_hooks';
import { useActiveNav } from '@/app/dashboard/_hooks/useActiveNav';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { logout } = useAuth();
  const [activeNav] = useActiveNav();
  const pageTitle = usePageTitle();
  const navigationItems = useNavigationItems();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setShowMenu(false));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="lg:hidden w-screen min-h-screen bg-nory-bg relative overflow-auto">
      <div className="px-6 pt-6 pb-4 flex justify-between items-center">
        <h1 className="text-heading xl:text-heading-xl text-nory-text m-0 font-grotesk">
          {pageTitle}
        </h1>
        <div className="flex gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-11 h-11 bg-nory-card border-2 border-nory-border rounded-img flex items-center justify-center shadow-brutal-sm cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <MenuIcon />
          </button>
          <Link
            href="/dashboard/events/create"
            prefetch={true}
            className="w-11 h-11 bg-nory-yellow border-2 border-nory-border rounded-img flex items-center justify-center shadow-brutal-sm cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <PlusIcon />
          </Link>
        </div>
      </div>

      <MobileMenu
        ref={menuRef}
        isOpen={showMenu}
        navigationItems={navigationItems}
        activeNav={activeNav}
        onLogout={handleLogout}
        onClose={() => setShowMenu(false)}
      />

      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );
};
