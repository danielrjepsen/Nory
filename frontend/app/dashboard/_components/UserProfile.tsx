'use client';

import { useTranslation } from 'react-i18next';
import { LogoutIcon } from './icons';
import type { User } from '../_types';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
}

export const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const { t } = useTranslation('dashboard');
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="border-t border-black/10 pt-5 mt-5">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {user?.name || t('user.profile.defaultName')}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {user?.email || ''}
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 bg-transparent text-red-600 border border-red-600 rounded-lg text-sm font-semibold transition-all hover:bg-red-600 hover:text-white"
      >
        <LogoutIcon />
        {t('user.logout.button')}
      </button>
    </div>
  );
};
