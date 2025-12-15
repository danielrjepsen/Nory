import { usePathname } from 'next/navigation';

export const usePageTitle = () => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'My Events';
    if (pathname.startsWith('/dashboard/events/create')) return 'Create Event';
    if (pathname.startsWith('/dashboard/events/') && pathname.includes('/manage')) return 'Manage Event';
    if (pathname.startsWith('/dashboard/events')) return 'Events';
    if (pathname.startsWith('/dashboard/galleries')) return 'Photo Galleries';
    if (pathname.startsWith('/dashboard/qr-codes')) return 'QR Codes';
    if (pathname.startsWith('/dashboard/analytics')) return 'Analytics';
    if (pathname.startsWith('/dashboard/settings')) return 'Settings';
    return 'My Events';
  };

  return getPageTitle();
};
