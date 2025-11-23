import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const useActiveNav = () => {
  const pathname = usePathname();

  const getActiveNav = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/events')) return 'events';
    if (pathname.startsWith('/galleries')) return 'galleries';
    if (pathname.startsWith('/qr-codes')) return 'qr';
    if (pathname.startsWith('/guests')) return 'guests';
    if (pathname.startsWith('/statistics') || pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  return useState(getActiveNav());
};
