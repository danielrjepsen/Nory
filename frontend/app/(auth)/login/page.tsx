'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/dashboard/_contexts/AuthContext';
import { AuthLayout } from './_components/AuthLayout';
import { LoginForm } from './_components/LoginForm';
import type { LoginCredentials } from '@/app/dashboard/_types/auth';

export default function LoginPage() {
    const { t } = useTranslation('auth');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = useCallback(async (credentials: LoginCredentials) => {
        setError('');
        setLoading(true);

        try {
            await login(credentials.email, credentials.password);
            // authContext handles redirect
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }, [login]);

    return (
        <AuthLayout>
            <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
            />
            <div className="text-center text-[#1a1a1a] text-sm font-grotesk">
                {t('login.noAccount')}{' '}
                <Link href="/register" className="text-[#1a1a1a] font-bold border-b-2 border-[#1a1a1a] transition-all duration-150 hover:bg-[#ffe951]">
                    {t('login.signUp')}
                </Link>
            </div>
        </AuthLayout>
    );
}