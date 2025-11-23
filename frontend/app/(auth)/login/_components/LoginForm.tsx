'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AuthHeader } from '@/app/(auth)/login/_components/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { Checkbox } from '@/components/auth//Checkbox';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormDivider } from '@/components/auth/FormDivider';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { validateEmail, validatePassword } from '@/lib/validators/auth-validators';
import type { LoginCredentials } from '@/app/dashboard/_types/auth';

interface LoginFormProps {
    onSubmit: (credentials: LoginCredentials) => Promise<void>;
    onGoogleSignIn: (credential: string) => Promise<void>;
    loading: boolean;
    error: string;
}

export function LoginForm({ onSubmit, onGoogleSignIn, loading, error }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginCredentials, string>>>({});

    const handleChange = useCallback((field: keyof LoginCredentials) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear field error on change
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [fieldErrors]);

    const validateForm = useCallback((): boolean => {
        const errors: Partial<Record<keyof LoginCredentials, string>> = {};

        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const passwordError = validatePassword(formData.password, 6);
        if (passwordError) errors.password = passwordError;

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        await onSubmit(formData);
    }, [formData, validateForm, onSubmit]);

    const isFormValid = !validateEmail(formData.email) && !validatePassword(formData.password, 6);

    return (
        <>
            <AuthHeader
                title="Welcome back"
                subtitle="Sign in to access your event galleries and create shared memories."
            />

            <ErrorAlert message={error} />

            <form onSubmit={handleSubmit} noValidate>
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={fieldErrors.email}
                    autoComplete="email"
                    required
                />

                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={fieldErrors.password}
                    autoComplete="current-password"
                    required
                />

                <div className="flex justify-between items-center mb-8 text-sm">
                    <Checkbox
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        label="Remember me"
                    />
                    <Link
                        href="/forgot-password"
                        className="text-blue-400 font-medium hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <SubmitButton
                    loading={loading}
                    loadingText="Signing in..."
                    disabled={!isFormValid || loading}
                >
                    Log in
                </SubmitButton>

                <FormDivider />
            </form>
        </>
    );
}