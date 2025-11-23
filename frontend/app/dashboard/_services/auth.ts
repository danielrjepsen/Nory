import { AuthResponse, LoginData, RegisterData, User } from '../_types/auth';
import { apiClient } from './api';

const TOKEN_REFRESH_BUFFER = 60; // refresh token 60s before expiry
const STORAGE_KEYS = {
    USER: 'auth_user',
} as const;

class AuthService {
    private user: User | null = null;
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private refreshPromise: Promise<boolean> | null = null;
    private refreshTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.initializeFromStorage();
        this.setupApiClient();
    }

    /**
     * Configure API client with auth providers
     */
    private setupApiClient(): void {
        apiClient.setAuthTokenProvider(() => this.getAccessToken());
        apiClient.setUnauthorizedHandler(() => this.refreshToken());
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

    async refreshToken(): Promise<boolean> {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.performTokenRefresh();

        try {
            return await this.refreshPromise;
        } finally {
            this.refreshPromise = null;
        }
    }

    private async performTokenRefresh(): Promise<boolean> {
        try {
            const result = await apiClient.post<AuthResponse>('/api/v1/auth/refresh');
            this.handleAuthResponse(result);
            return true;
        } catch (error: any) {
            console.error('Token refresh error:', error);
            if (error.status === 401 || error.status === 400) {
                this.clearAuth();
            }
            return false;
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

    private handleAuthResponse(response: AuthResponse): void {
        if (response.token) {
            this.setAccessToken(response.token, response.expiresIn);
        }

        if (response.user) {
            this.setUser(response.user);
        }
    }

    setAccessToken(token: string, expiresIn: number): void {
        this.accessToken = token;
        this.tokenExpiry = Date.now() + expiresIn * 1000;
        this.scheduleTokenRefresh(expiresIn);
    }

    private scheduleTokenRefresh(expiresIn: number): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        const refreshIn = Math.max(0, (expiresIn - TOKEN_REFRESH_BUFFER) * 1000);
        if (refreshIn > 0) {
            this.refreshTimer = setTimeout(() => {
                this.refreshToken();
            }, refreshIn);
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
        this.accessToken = null;
        this.tokenExpiry = null;

        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }

        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    }

    getAccessToken(): string | null {
        if (this.tokenExpiry && Date.now() >= this.tokenExpiry) {
            this.refreshToken();
            return null;
        }
        return this.accessToken;
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

    getTokenInfo() {
        return {
            hasToken: !!this.accessToken,
            hasUser: !!this.user,
            tokenExpiry: this.tokenExpiry ? new Date(this.tokenExpiry) : null,
            timeUntilExpiry: this.tokenExpiry ? Math.max(0, this.tokenExpiry - Date.now()) : null,
        };
    }
}

export const authService = new AuthService();

if (typeof window !== 'undefined') {
    (window as any).authService = authService;
}
