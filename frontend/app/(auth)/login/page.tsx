'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/dashboard/_contexts/AuthContext';
import { AuthLayout } from './_components/AuthLayout';
import { LoginForm } from './_components/LoginForm';
import type { LoginCredentials } from '@/app/dashboard/_types/auth';

export default function LoginPage() {
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

    const handleGoogleSignIn = useCallback(async (credential: string) => {
        setError('');
        setLoading(true);

        try {
            // TODO: Implement Google sign-in
            console.log('Google sign-in:', credential);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthLayout>
            <LoginForm
                onSubmit={handleLogin}
                onGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                error={error}
            />
            <div className="text-center text-[#636e72] text-sm mt-4">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#74b9ff] font-semibold hover:underline cursor-pointer">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    );
}