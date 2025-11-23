import { useRouter } from 'next/navigation';
import { useActiveNav } from './useActiveNav';
import type { NavigationItem } from '../_types';

export const useNavigation = () => {
  const router = useRouter();
  const [activeNav, setActiveNav] = useActiveNav();

  const handleNavClick = (item: NavigationItem) => {
    setActiveNav(item.id);
    router.push(item.path);
  };

  return { activeNav, handleNavClick };
};
