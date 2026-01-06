export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
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

export type LoginCredentials = LoginData;