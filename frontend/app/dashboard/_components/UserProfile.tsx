'use client';

import { useTranslation } from 'react-i18next';
import type { User } from '../_types';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
}

export const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const { t } = useTranslation('dashboard');
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <button
      onClick={onLogout}
      className="flex items-center gap-3 w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-[14px] shadow-brutal-sm transition-all duration-150 hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      <div className="w-9 h-9 rounded-btn bg-nory-yellow text-nory-black border-2 border-nory-border flex items-center justify-center font-bold text-[0.85rem] font-grotesk flex-shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="text-[0.85rem] font-semibold text-nory-text truncate font-grotesk">
          {user?.name || t('user.profile.defaultName')}
        </div>
        <div className="text-[0.7rem] text-nory-muted truncate font-grotesk">
          {user?.email || ''}
        </div>
      </div>
    </button>
  );
};
