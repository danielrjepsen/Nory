'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as authService from '../_services/auth';
import { User } from '../_types/auth';
import { getApiUrl } from '@/utils/urls';

interface RegisterData {
    email: string;
    password: string;
    name: string;
    organizationName?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isSetupComplete: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PUBLIC_PATH_PREFIXES = ['/login', '/register', '/slideshow', '/remote', '/wizard'];

const isPublicPath = (pathname: string): boolean => {
    if (pathname === '/') return true;
    return PUBLIC_PATH_PREFIXES.some(path => pathname.startsWith(path));
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSetupComplete, setIsSetupComplete] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkSetupStatus = useCallback(async () => {
        try {
            const response = await fetch(`${getApiUrl()}/api/v1/setup/status`, {
                credentials: 'include',
            });
            if (response.ok) {
                const status = await response.json();
                setIsSetupComplete(status.isConfigured);
                return status.isConfigured;
            }
        } catch {
        }
        return true;
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const loggedInUser = await authService.login({ email, password });
        setUser(loggedInUser);
        setIsSetupComplete(true); // After login, setup is complete
        router.push('/dashboard');
    }, [router]);

    const register = useCallback(async (data: RegisterData) => {
        await authService.register(data);
        router.push('/login');
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const initializeAuth = async () => {
            const setupComplete = await checkSetupStatus();

            if (!setupComplete && pathname !== '/wizard') {
                router.push('/wizard');
                setLoading(false);
                return;
            }

            if (isPublicPath(pathname)) {
                setLoading(false);
                return;
            }

            await checkAuth();
        };

        initializeAuth();
    }, [checkAuth, checkSetupStatus, pathname, router]);

    useEffect(() => {
        if (loading) return;

        if (!isSetupComplete) {
            if (pathname !== '/wizard') {
                router.push('/wizard');
            }
            return;
        }

        const isPublic = isPublicPath(pathname);

        if (!user && !isPublic) {
            router.push('/login');
        } else if (user && (pathname === '/login' || pathname === '/register')) {
            router.push('/dashboard');
        }
    }, [user, loading, pathname, router, isSetupComplete]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            isSetupComplete,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthContext };
