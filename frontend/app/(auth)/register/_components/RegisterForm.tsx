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
import {
    validateEmail,
    validatePassword,
    validateName,
    getPasswordError,
} from '@/lib/validators/auth-validators';
import type { RegisterData } from '@/app/dashboard/_types/auth';

interface RegisterFormProps {
    onSubmit: (data: RegisterData) => Promise<void>;
    loading: boolean;
    error: string;
}

export function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
    const { t } = useTranslation('auth');
    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        password: '',
        name: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterData | 'terms', string>>>({});

    const handleChange = useCallback((field: keyof RegisterData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [fieldErrors]);

    const validateForm = useCallback((): boolean => {
        const errors: Partial<Record<keyof RegisterData, string>> = {};

        const nameError = validateName(formData.name);
        if (nameError) errors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) errors.password = getPasswordError(formData.password);

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!agreedToTerms) {
            setFieldErrors(prev => ({
                ...prev,
                terms: t('register.errors.termsRequired'),
            }));
            return;
        }

        await onSubmit(formData);
    }, [formData, agreedToTerms, validateForm, onSubmit, t]);

    const isFormValid =
        !validateName(formData.name) &&
        !validateEmail(formData.email) &&
        !validatePassword(formData.password) &&
        agreedToTerms;

    return (
        <>
            <AuthHeader
                title={t('register.title')}
                subtitle={t('register.subtitle')}
            />

            <ErrorAlert message={error} />

            <form onSubmit={handleSubmit} noValidate>
                <FormInput
                    label={t('register.fullNameLabel')}
                    type="text"
                    name="name"
                    placeholder={t('register.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={fieldErrors.name}
                    autoComplete="name"
                    required
                />

                <FormInput
                    label={t('register.emailLabel')}
                    type="email"
                    name="email"
                    placeholder={t('register.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={fieldErrors.email}
                    autoComplete="email"
                    required
                />

                <FormInput
                    label={t('register.passwordLabel')}
                    type="password"
                    name="password"
                    placeholder={t('register.passwordPlaceholder')}
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={fieldErrors.password}
                    autoComplete="new-password"
                    required
                />

                <div className="mb-8">
                    <Checkbox
                        checked={agreedToTerms}
                        onChange={() => {
                            setAgreedToTerms(!agreedToTerms);
                            if (fieldErrors.terms) {
                                setFieldErrors(prev => ({ ...prev, terms: undefined }));
                            }
                        }}
                        label={t('register.termsAgreement')}
                    />
                    {fieldErrors.terms && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.terms}</p>
                    )}
                </div>

                <SubmitButton
                    loading={loading}
                    loadingText={t('register.submitting')}
                    disabled={!isFormValid || loading}
                >
                    {t('register.submit')}
                </SubmitButton>

                <FormDivider />

                <p className="text-center text-sm text-gray-600">
                    {t('register.hasAccount')}{' '}
                    <Link href="/login" className="text-blue-400 font-medium hover:underline">
                        {t('register.signIn')}
                    </Link>
                </p>
            </form>
        </>
    );
}
