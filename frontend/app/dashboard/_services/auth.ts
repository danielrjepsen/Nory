import { apiClient } from '@/lib/api';
import type { AuthResponse, LoginData, RegisterData, User } from '../_types/auth';

const USER_STORAGE_KEY = 'nory-user';

let cachedUser: User | null = null;

export function getUser(): User | null {
  if (cachedUser) return cachedUser;
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      cachedUser = JSON.parse(stored);
      return cachedUser;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export function setUser(user: User | null): void {
  cachedUser = user;
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

const Endpoints = {
  register: '/api/v1/auth/register',
  login: '/api/v1/auth/login',
  logout: '/api/v1/auth/logout',
  me: '/api/v1/auth/me',
} as const;

export async function register(data: RegisterData): Promise<User> {
  const result = await apiClient.post<AuthResponse>(Endpoints.register, data);
  if (!result.user) throw new Error('Registration failed');
  return result.user;
}

export async function login(data: LoginData): Promise<User> {
  const result = await apiClient.post<AuthResponse>(Endpoints.login, data);
  if (!result.user) throw new Error('Login failed');
  return result.user;
}

export async function logout(): Promise<void> {
  await apiClient.post(Endpoints.logout);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiClient.get<User>(Endpoints.me);
  } catch {
    return null;
  }
}
