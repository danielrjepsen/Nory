'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../_contexts/AuthContext';
import { MobileMenu } from '../MobileMenu';
import { MenuIcon, PlusIcon } from '../icons';
import { useNavigation, usePageTitle, useClickOutside, useNavigationItems } from '@/app/dashboard/_hooks';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const { activeNav, handleNavClick } = useNavigation();
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
    <div className="lg:hidden w-screen min-h-screen bg-[#e5e5ea] relative overflow-auto">
      <div className="px-6 pt-6 pb-4 flex justify-between items-center">
        <h1 className="text-[42px] font-bold text-black m-0">
          {pageTitle}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-transparent border-0 cursor-pointer p-0"
          >
            <MenuIcon />
          </button>
          <button
            onClick={() => router.push('/events/create')}
            className="bg-transparent border-0 cursor-pointer p-0"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      <MobileMenu
        ref={menuRef}
        isOpen={showMenu}
        navigationItems={navigationItems}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onLogout={handleLogout}
        onClose={() => setShowMenu(false)}
      />

      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );
};
