'use client';

import { useState, useCallback } from 'react';
import { AuthHeader } from '@/app/(auth)/login/_components/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { FormSelect } from '@/components/auth/FormSelect';
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
import type { RegisterData } from '@/types/auth';

interface RegisterFormProps {
    onSubmit: (data: RegisterData) => Promise<void>;
    loading: boolean;
    error: string;
    selectedPlan?: { name: string; price: string } | null;
}

const ORG_TYPE_OPTIONS = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'agency', label: 'Agency' },
];

export function RegisterForm({
    onSubmit,
    loading,
    error,
    selectedPlan,
}: RegisterFormProps) {
    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        password: '',
        name: '',
        orgName: '',
        orgType: 'individual',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});

    const handleChange = useCallback((field: keyof RegisterData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear field error on change
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
                terms: 'You must agree to the Terms of Service',
            }));
            return;
        }

        await onSubmit(formData);
    }, [formData, agreedToTerms, validateForm, onSubmit]);

    const isFormValid =
        !validateName(formData.name) &&
        !validateEmail(formData.email) &&
        !validatePassword(formData.password) &&
        agreedToTerms;

    return (
        <>
            <AuthHeader
                title="Create Account"
                subtitle="Get started with Nory today and create amazing event experiences."
            />


            <ErrorAlert message={error} />

            <form onSubmit={handleSubmit} noValidate>
                <FormInput
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={fieldErrors.name}
                    autoComplete="name"
                    required
                />

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
                    placeholder="Min 8 chars, uppercase, lowercase, digit"
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={fieldErrors.password}
                    autoComplete="new-password"
                    required
                />

                <FormInput
                    label="Organization Name (Optional)"
                    type="text"
                    name="orgName"
                    placeholder="Your company or organization name"
                    value={formData.orgName}
                    onChange={handleChange('orgName')}
                    autoComplete="organization"
                />

                <FormSelect
                    label="Organization Type"
                    name="orgType"
                    value={formData.orgType}
                    onChange={handleChange('orgType')}
                    options={ORG_TYPE_OPTIONS}
                />

                <div className="mb-8">
                    <Checkbox
                        checked={agreedToTerms}
                        onChange={() => setAgreedToTerms(!agreedToTerms)}
                        label="I agree to the Terms of Service and Privacy Policy"
                    />
                    {fieldErrors.terms && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.terms}</p>
                    )}
                </div>

                <SubmitButton
                    loading={loading}
                    loadingText="Creating Account..."
                    disabled={!isFormValid || loading}
                >
                    Create Account
                </SubmitButton>

                <FormDivider />
            </form>
        </>
    );
}
