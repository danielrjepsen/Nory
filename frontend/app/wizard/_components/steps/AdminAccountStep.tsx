'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminAccount } from '../../_types';

interface AdminAccountStepProps {
  data: AdminAccount;
  onChange: (data: AdminAccount) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AdminAccountStep({ data, onChange, onNext, onBack }: AdminAccountStepProps) {
  const { t } = useTranslation('wizard');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (field: keyof AdminAccount) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isValidPassword = data.password.length >= 8;
  const passwordsMatch = data.password === confirmPassword;
  const isValid = data.name.trim().length > 0 && isValidEmail && isValidPassword && passwordsMatch;

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center shadow-brutal-sm">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-xl font-bold text-nory-black mb-2">
          {t('steps.admin.title')}
        </h2>
        <p className="text-nory-black/60 text-sm">
          {t('steps.admin.description')}
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-bold text-nory-black mb-2">
            {t('steps.admin.fields.name.label')}
          </label>
          <input
            type="text"
            placeholder={t('steps.admin.fields.name.placeholder')}
            value={data.name}
            onChange={handleChange('name')}
            autoComplete="name"
            className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow focus:border-nory-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-nory-black mb-2">
            {t('steps.admin.fields.email.label')}
          </label>
          <input
            type="email"
            placeholder={t('steps.admin.fields.email.placeholder')}
            value={data.email}
            onChange={handleChange('email')}
            autoComplete="email"
            className={`w-full px-4 py-3 bg-nory-white border-2 rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow ${
              data.email && !isValidEmail ? 'border-red-500' : 'border-nory-black'
            }`}
          />
          {data.email && !isValidEmail && (
            <p className="text-xs text-red-500 mt-1">{t('steps.admin.errors.invalidEmail')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-nory-black mb-2">
            {t('steps.admin.fields.password.label')}
          </label>
          <input
            type="password"
            placeholder={t('steps.admin.fields.password.placeholder')}
            value={data.password}
            onChange={handleChange('password')}
            autoComplete="new-password"
            className={`w-full px-4 py-3 bg-nory-white border-2 rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow ${
              data.password && !isValidPassword ? 'border-red-500' : 'border-nory-black'
            }`}
          />
          {data.password && !isValidPassword && (
            <p className="text-xs text-red-500 mt-1">{t('steps.admin.errors.passwordTooShort')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-nory-black mb-2">
            {t('steps.admin.fields.confirmPassword.label')}
          </label>
          <input
            type="password"
            placeholder={t('steps.admin.fields.confirmPassword.placeholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={`w-full px-4 py-3 bg-nory-white border-2 rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow ${
              confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-nory-black'
            }`}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500 mt-1">{t('steps.admin.errors.passwordMismatch')}</p>
          )}
        </div>

        <div className="bg-nory-gray border-2 border-nory-black rounded-xl p-4">
          <div className="font-bold text-nory-black text-sm mb-2">{t('steps.admin.passwordRequirements.title')}</div>
          <div className={`flex items-center gap-2 text-sm ${data.password.length >= 8 ? 'text-green-600' : 'text-nory-black/50'}`}>
            <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${data.password.length >= 8 ? 'bg-nory-yellow border-nory-black' : 'border-nory-black/30'}`}>
              {data.password.length >= 8 && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {t('steps.admin.passwordRequirements.minLength')}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-nory-gray hover:bg-nory-gray/80 text-nory-black font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all"
        >
          {t('buttons.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-nory-black hover:bg-nory-black/90 disabled:bg-nory-black/30 disabled:cursor-not-allowed text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {t('buttons.next')}
        </button>
      </div>
    </div>
  );
}
