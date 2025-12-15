'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../_contexts/AuthContext';
import { DesktopSidebar } from '../DesktopSidebar';
import { PlusIcon } from '@/app/dashboard/_components/icons';
import { useNavigation, usePageTitle, useNavigationItems } from '@/app/dashboard/_hooks';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const { user, logout } = useAuth();
  const { activeNav, handleNavClick } = useNavigation();
  const pageTitle = usePageTitle();
  const navigationItems = useNavigationItems();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="hidden lg:flex w-screen h-screen bg-[#e5e5ea] overflow-hidden">
      <DesktopSidebar
        navigationItems={navigationItems}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 h-screen overflow-y-auto px-10 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 m-0">
            {pageTitle}
          </h1>
          <button
            onClick={() => router.push('/dashboard/events/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold transition-all hover:bg-gray-800"
          >
            <PlusIcon />
            {t('events.createButton')}
          </button>
        </div>

        <div>
          {children}
        </div>
      </main>
    </div>
  );
};
