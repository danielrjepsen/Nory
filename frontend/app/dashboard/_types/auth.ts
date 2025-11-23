export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiresIn: number;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Alias for compatibility
export type LoginCredentials = LoginData;