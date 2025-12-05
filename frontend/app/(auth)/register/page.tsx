'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/app/dashboard/_contexts/AuthContext';
import { AuthLayout } from '../login/_components/AuthLayout';
import { RegisterForm } from './_components/RegisterForm';
import type { RegisterData } from '@/app/dashboard/_types/auth';

export default function RegisterPage() {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = useCallback(async (data: RegisterData) => {
        setError('');
        setLoading(true);

        try {
            await register(data);
            // authContext handles redirect
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    }, [register]);

    return (
        <AuthLayout>
            <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
            />
        </AuthLayout>
    );
}
