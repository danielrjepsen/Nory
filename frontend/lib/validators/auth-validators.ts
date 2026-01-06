const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string {
    const trimmed = email.trim();

    if (!trimmed) {
        return 'Email is required';
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return 'Please enter a valid email address';
    }

    return '';
}

export function validatePassword(password: string, minLength: number = 8): string {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters`;
    }

    if (minLength >= 8) {
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }

        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }

        if (!/\d/.test(password)) {
            return 'Password must contain at least one number';
        }

        if (new Set(password).size < 3) {
            return 'Password must have at least 3 unique characters';
        }
    }

    return '';
}

export function getPasswordError(password: string): string {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }

    if (!/\d/.test(password)) {
        return 'Password must contain at least one number';
    }

    if (new Set(password).size < 3) {
        return 'Password must have at least 3 unique characters';
    }

    return '';
}

export function validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed) {
        return 'Name is required';
    }

    if (trimmed.length < 2) {
        return 'Name must be at least 2 characters';
    }

    return '';
}

export function hasError(errors: Record<string, string | undefined>, field: string): boolean {
    return Boolean(errors[field]);
}