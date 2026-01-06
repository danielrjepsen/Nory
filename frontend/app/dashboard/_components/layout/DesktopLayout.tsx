'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../_contexts/AuthContext';
import { useSidebar, COLLAPSED_WIDTH, EXPANDED_WIDTH } from '../../_contexts/SidebarContext';
import { DesktopSidebar } from '../DesktopSidebar';
import { PlusIcon } from '@/app/dashboard/_components/icons';
import { usePageTitle, useNavigationItems } from '@/app/dashboard/_hooks';
import { useActiveNav } from '@/app/dashboard/_hooks/useActiveNav';
import { ThemeToggle } from '@/lib/theme';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  const { t } = useTranslation(['dashboard', 'navigation']);
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const [activeNav] = useActiveNav();
  const pageTitle = usePageTitle();
  const navigationItems = useNavigationItems();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isOverview = activeNav === 'overview';

  const subtitleKey = `navigation:subtitles.${activeNav}`;
  const subtitle = t(subtitleKey, { defaultValue: '' }) || null;
  const mainMargin = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div className="hidden lg:block min-h-screen bg-nory-bg">
      <DesktopSidebar
        navigationItems={navigationItems}
        activeNav={activeNav}
        user={user}
        onLogout={handleLogout}
      />

      <main
        className="p-7 min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: mainMargin }}
      >
        <div className="max-w-[1400px]">
          <header className="flex justify-between items-start mb-9">
            <div className="flex flex-col gap-2">
              <h1 className="text-[48px] font-extrabold text-nory-text m-0 font-bricolage italic tracking-tight leading-none">
                {pageTitle}
              </h1>
              {subtitle && (
                <p className="text-[15px] text-nory-muted">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <LanguageSwitcher />
              <ThemeToggle />
              {isOverview && (
                <Link
                  href="/dashboard/events/create"
                  prefetch={true}
                  className="group flex items-center gap-2 px-[18px] py-3 bg-nory-yellow text-nory-black border-[2.5px] border-nory-border rounded-[10px] text-sm font-semibold font-grotesk shadow-brutal transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--nory-border)]"
                >
                  <span className="plus-icon-animated">
                    <PlusIcon />
                  </span>
                  {t('events.createButton')}
                </Link>
              )}
            </div>
          </header>

          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
