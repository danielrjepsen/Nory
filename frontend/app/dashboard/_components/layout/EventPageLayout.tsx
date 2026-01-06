'use client';

import { MobileLayout } from './MobileLayout';
import { EventLayout } from './EventLayout';
import { SidebarProvider } from '../../_contexts/SidebarContext';

interface EventPageLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
}

export function EventPageLayout({ children, activeNav = 'apps' }: EventPageLayoutProps) {
  return (
    <SidebarProvider>
      <MobileLayout>{children}</MobileLayout>
      <EventLayout activeNav={activeNav}>{children}</EventLayout>
    </SidebarProvider>
  );
}
