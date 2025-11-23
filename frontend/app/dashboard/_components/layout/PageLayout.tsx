'use client';

import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';

interface PageLayoutProps {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <>
            <MobileLayout>{children}</MobileLayout>
            <DesktopLayout>{children}</DesktopLayout>
        </>
    );
}
