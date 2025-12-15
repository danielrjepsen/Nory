import Image from 'next/image';
import { NavButton } from './NavButton';
import { UserProfile } from './UserProfile';
import type { NavigationItem, User } from '../_types';

interface DesktopSidebarProps {
  navigationItems: NavigationItem[];
  activeNav: string;
  onNavClick: (item: NavigationItem) => void;
  user: User | null;
  onLogout: () => void;
}

export const DesktopSidebar = ({
  navigationItems,
  activeNav,
  onNavClick,
  user,
  onLogout
}: DesktopSidebarProps) => {
  return (
    <aside className="w-[260px] h-screen px-6 py-8 flex flex-col">
      <div className="mb-12">
        <Image
          src="/NORY-logo.svg"
          alt="Nory"
          width={120}
          height={40}
          priority
        />
      </div>

      <nav className="flex-1">
        {navigationItems.map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeNav === item.id}
            onClick={() => onNavClick(item)}
          />
        ))}
      </nav>

      <UserProfile user={user} onLogout={onLogout} />
    </aside>
  );
};
