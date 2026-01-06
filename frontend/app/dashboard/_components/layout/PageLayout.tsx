'use client';

import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';
import { SidebarProvider } from '../../_contexts/SidebarContext';

interface PageLayoutProps {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <SidebarProvider>
            <MobileLayout>{children}</MobileLayout>
            <DesktopLayout>{children}</DesktopLayout>
        </SidebarProvider>
    );
}
