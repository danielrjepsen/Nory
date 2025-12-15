import { apiClient } from '@/lib/api';
import { AuthResponse, LoginData, RegisterData, User } from '../_types/auth';

const STORAGE_KEYS = {
    USER: 'auth_user',
} as const;

class AuthService {
    private user: User | null = null;

    constructor() {
        this.initializeFromStorage();
        this.setupApiClient();
    }

    private setupApiClient(): void {
        apiClient.setAuthTokenProvider(() => null);

        apiClient.setUnauthorizedHandler(async () => {
            this.clearAuth();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return false;
        });
    }

    private initializeFromStorage(): void {
        if (typeof window === 'undefined') return;

        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        if (userData) {
            try {
                this.user = JSON.parse(userData);
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem(STORAGE_KEYS.USER);
            }
        }
    }

    async register(data: RegisterData): Promise<void> {
        try {
            const result = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
            this.handleAuthResponse(result);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(data: LoginData): Promise<void> {
        try {
            const result = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
            this.handleAuthResponse(result);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await apiClient.post('/api/v1/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
        }
    }

    async verifyAuth(): Promise<boolean> {
        try {
            const user = await apiClient.get<User>('/api/v1/auth/me');
            if (user) {
                this.setUser(user);
                return true;
            }
            return false;
        } catch {
            this.clearAuth();
            return false;
        }
    }

    private handleAuthResponse(response: AuthResponse): void {
        if (response.user) {
            this.setUser(response.user);
        }
    }

    setUser(user: User): void {
        this.user = user;

        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
    }

    private clearAuth(): void {
        this.user = null;

        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    }

    getUser(): User | null {
        if (!this.user && typeof window !== 'undefined') {
            this.initializeFromStorage();
        }
        return this.user;
    }

    isAuthenticated(): boolean {
        return !!this.getUser();
    }
}

export const authService = new AuthService();

if (typeof window !== 'undefined') {
    (window as any).authService = authService;
}
