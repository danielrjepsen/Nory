'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { NoryCardLogo } from '@/components/icons/NoryCardLogo';
import { UserProfile } from './UserProfile';
import { useSidebar, COLLAPSED_WIDTH, EXPANDED_WIDTH } from '../_contexts/SidebarContext';
import type { NavigationItem, User } from '../_types';

interface DesktopSidebarProps {
  navigationItems: NavigationItem[];
  activeNav: string;
  user: User | null;
  onLogout: () => void;
  backItem?: NavigationItem;
}

export const DesktopSidebar = ({
  navigationItems,
  activeNav,
  user,
  onLogout,
  backItem,
}: DesktopSidebarProps) => {
  const { t } = useTranslation('common');
  const { isCollapsed, toggleCollapsed } = useSidebar();

  const sidebarWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <aside
      className="fixed h-screen z-50 transition-all duration-300 ease-in-out"
      style={{ width: sidebarWidth, padding: isCollapsed ? 12 : 20 }}
    >
      {/* Toggle Button - positioned outside the card */}
      <button
        onClick={toggleCollapsed}
        className="absolute right-0 top-8 w-6 h-6 bg-nory-card border-2 border-nory-border rounded-full flex items-center justify-center z-10 hover:bg-nory-yellow transition-all duration-150 shadow-sm translate-x-1/2"
        aria-label={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="bg-nory-black dark:bg-[#1a1a18] rounded-[16px] h-full flex flex-col overflow-hidden">

        {/* Inner content with padding */}
        <div className={`flex flex-col h-full ${isCollapsed ? 'px-2 py-4' : 'p-4'}`}>
          {/* Logo */}
          <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'gap-3 px-1'}`}>
            <NoryCardLogo size={isCollapsed ? 'small' : 'default'} dark />
            {!isCollapsed && (
              <span className="font-bricolage font-extrabold text-xl text-white tracking-tight">
                NORY
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 flex-1">
            {backItem && (
              <Link
                href={backItem.path}
                className={`flex items-center rounded-[10px] text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-150 ${isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'
                  }`}
                title={isCollapsed ? backItem.label : undefined}
              >
                <span className="w-[18px] h-[18px] flex-shrink-0">{backItem.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{backItem.label}</span>
                )}
              </Link>
            )}

            {navigationItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center rounded-[10px] border-2 transition-all duration-150 ${isActive
                    ? 'bg-nory-yellow text-nory-black border-nory-black shadow-[3px_3px_0_rgba(0,0,0,0.3)] font-semibold'
                    : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
                    } ${isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="w-[18px] h-[18px] flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className={`pt-4 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {isCollapsed ? (
              <button
                onClick={onLogout}
                className="w-10 h-10 rounded-lg bg-nory-yellow text-nory-black border-2 border-nory-border flex items-center justify-center font-bold text-sm font-grotesk hover:shadow-brutal-sm transition-all"
                title={user?.name || t('user')}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
            ) : (
              <UserProfile user={user} onLogout={onLogout} />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
