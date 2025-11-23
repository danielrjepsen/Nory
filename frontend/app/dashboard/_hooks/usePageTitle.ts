import { usePathname } from 'next/navigation';

export const usePageTitle = () => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'My Events';
    if (pathname.startsWith('/events/create')) return 'Create Event';
    if (pathname.startsWith('/events/') && pathname.includes('/manage')) return 'Manage Event';
    if (pathname.startsWith('/events')) return 'Events';
    if (pathname.startsWith('/galleries')) return 'Photo Galleries';
    if (pathname.startsWith('/analytics')) return 'Analytics';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'My Events';
  };

  return getPageTitle();
};
