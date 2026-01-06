'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../_contexts/AuthContext';
import { useSidebar, COLLAPSED_WIDTH, EXPANDED_WIDTH } from '../../_contexts/SidebarContext';
import { DesktopSidebar } from '../DesktopSidebar';
import { useEventNavigationItems } from '@/app/dashboard/_hooks';
import { getEventDetails } from '@/app/dashboard/_services/events';
import type { EventData } from '../../_types/events';

interface EventLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
}

export const EventLayout = ({ children, activeNav = 'overview' }: EventLayoutProps) => {
  const params = useParams();
  const { t } = useTranslation('dashboard');
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const { backItem, navigationItems } = useEventNavigationItems({ eventId });

  const currentNav = navigationItems.find((item) => item.id === activeNav);
  const pageTitle = currentNav?.label || '';

  useEffect(() => {
    if (eventId) {
      getEventDetails(eventId).then(setEvent).catch(console.error);
    }
  }, [eventId]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const mainMargin = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div className="hidden lg:block min-h-screen bg-nory-bg">
      <DesktopSidebar
        navigationItems={navigationItems}
        activeNav={activeNav}
        user={user}
        onLogout={handleLogout}
        backItem={backItem}
      />

      <main
        className="p-7 min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: mainMargin }}
      >
        <div className="max-w-[1400px]">
          {activeNav !== 'overview' && (
            <header className="mb-6">
              <h1 className="text-[48px] font-extrabold text-nory-text m-0 font-bricolage italic tracking-tight leading-none">
                {event?.name || '...'}
              </h1>
              <p className="text-[15px] text-nory-muted mt-2">
                {pageTitle}
              </p>
            </header>
          )}

          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
