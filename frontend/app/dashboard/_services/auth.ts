import { apiClient } from '@/lib/api';
import type { AuthResponse, LoginData, RegisterData, User } from '../_types/auth';

const Endpoints = {
  register: '/api/v1/auth/register',
  login: '/api/v1/auth/login',
  logout: '/api/v1/auth/logout',
  me: '/api/v1/auth/me',
} as const;

const STORAGE_KEY = 'auth_user';

let currentUser: User | null = null;

function initializeFromStorage(): void {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

function clearAuth(): void {
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setupApiClient(): void {
  apiClient.setAuthTokenProvider(() => null);
  apiClient.setUnauthorizedHandler(async () => {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  });
}

initializeFromStorage();
setupApiClient();

export async function register(data: RegisterData): Promise<void> {
  const result = await apiClient.post<AuthResponse>(Endpoints.register, data);
  if (result.user) setUser(result.user);
}

export async function login(data: LoginData): Promise<void> {
  const result = await apiClient.post<AuthResponse>(Endpoints.login, data);
  if (result.user) setUser(result.user);
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post(Endpoints.logout);
  } finally {
    clearAuth();
  }
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const user = await apiClient.get<User>(Endpoints.me);
    if (user) {
      setUser(user);
      return true;
    }
    return false;
  } catch {
    clearAuth();
    return false;
  }
}

export function setUser(user: User): void {
  currentUser = user;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (!currentUser && typeof window !== 'undefined') {
    initializeFromStorage();
  }
  return currentUser;
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
