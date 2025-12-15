import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const useActiveNav = () => {
  const pathname = usePathname();

  const getActiveNav = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/events')) return 'events';
    if (pathname.startsWith('/dashboard/galleries')) return 'galleries';
    if (pathname.startsWith('/dashboard/qr-codes')) return 'qr';
    if (pathname.startsWith('/guests')) return 'guests';
    if (pathname.startsWith('/dashboard/statistics') || pathname.startsWith('/dashboard/analytics')) return 'analytics';
    if (pathname.startsWith('/dashboard/settings')) return 'settings';
    return 'dashboard';
  };

  return useState(getActiveNav());
};
