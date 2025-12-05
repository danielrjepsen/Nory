'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from '@/app/(auth)/login/_components/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { Checkbox } from '@/components/auth/Checkbox';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormDivider } from '@/components/auth/FormDivider';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { validateEmail, validatePassword } from '@/lib/validators/auth-validators';
import type { LoginCredentials } from '@/app/dashboard/_types/auth';

interface LoginFormProps {
    onSubmit: (credentials: LoginCredentials) => Promise<void>;
    loading: boolean;
    error: string;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
    const { t } = useTranslation('auth');
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
        // clear field error on change
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
                title={t('login.title')}
                subtitle={t('login.subtitle')}
            />

            <ErrorAlert message={error} />

            <form onSubmit={handleSubmit} noValidate>
                <FormInput
                    label={t('login.emailLabel')}
                    type="email"
                    name="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={fieldErrors.email}
                    autoComplete="email"
                    required
                />

                <FormInput
                    label={t('login.passwordLabel')}
                    type="password"
                    name="password"
                    placeholder={t('login.passwordPlaceholder')}
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
                        label={t('login.rememberMe')}
                    />
                    <Link
                        href="/forgot-password"
                        className="text-blue-400 font-medium hover:underline"
                    >
                        {t('login.forgotPassword')}
                    </Link>
                </div>

                <SubmitButton
                    loading={loading}
                    loadingText={t('login.submitting')}
                    disabled={!isFormValid || loading}
                >
                    {t('login.submit')}
                </SubmitButton>

                <FormDivider />
            </form>
        </>
    );
}