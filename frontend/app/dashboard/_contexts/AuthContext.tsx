'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '../_services/auth';
import { User } from '../_types/auth';

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
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

const PUBLIC_PATHS = ['/login', '/register'];
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

const isPublicPath = (pathname: string): boolean => {
    return PUBLIC_PATHS.some(path => pathname.startsWith(path));
};

const parseAuthFromHash = (): { token: string; user: User; expiresIn: number } | null => {
    const hash = window.location.hash;
    if (!hash.includes('#auth=')) return null;

    try {
        const authDataParam = hash.split('#auth=')[1];
        const authData = JSON.parse(atob(authDataParam));

        if (authData.token && authData.user) {
            window.location.hash = '';
            return authData;
        }
    } catch (error) {
        console.error('Failed to parse auth data from URL:', error);
    }

    return null;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const initializeAuth = useCallback(async () => {
        try {
            // Check for auth data in URL hash
            const hashAuth = parseAuthFromHash();
            if (hashAuth) {
                authService.setAccessToken(hashAuth.token, hashAuth.expiresIn);
                authService.setUser(hashAuth.user);
                setUser(hashAuth.user);
                return;
            }

            // Check for stored user
            const storedUser = authService.getUser();
            if (storedUser) {
                setUser(storedUser);
                return;
            }

            // No user found
            setUser(null);
        } catch (error) {
            console.error('Auth initialization error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAuth = useCallback(async (): Promise<boolean> => {
        try {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                const currentUser = authService.getUser();
                setUser(currentUser);
                return true;
            }
            setUser(null);
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            setUser(null);
            return false;
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            await authService.login({ email, password });
            const currentUser = authService.getUser();

            if (currentUser) {
                setUser(currentUser);
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, [router]);

    const register = useCallback(async (data: RegisterData) => {
        try {
            await authService.register(data);
            // After successful registration, redirect or auto-login handled by service
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear user even if logout fails
            setUser(null);
            router.push('/login');
        }
    }, [router]);

    // Initialize auth on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Handle redirects based on auth state
    useEffect(() => {
        if (loading) return;

        const isPublic = isPublicPath(pathname);

        if (!user && !isPublic) {
            router.push('/login');
        } else if (user && (pathname === '/login' || pathname === '/register')) {
            router.push('/');
        }
    }, [user, loading, pathname, router]);

    // Periodic auth validation
    useEffect(() => {
        if (loading || !user) return;

        const validateAuth = async () => {
            const isValid = await refreshAuth();
            if (!isValid) {
                await logout();
            }
        };

        const interval = setInterval(validateAuth, AUTH_CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [user, loading, refreshAuth, logout]);

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshAuth,
    };

    return (
        <AuthContext.Provider value={value}>
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
