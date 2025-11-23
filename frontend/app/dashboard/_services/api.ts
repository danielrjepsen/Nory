import { getAuthApiUrl } from '@/utils/urls';

const API_BASE_URL = getAuthApiUrl();

// Types
export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
}

export class ApiClient {
  private baseUrl: string;
  private getAuthToken: (() => string | null) | null = null;
  private onUnauthorized: (() => Promise<boolean>) | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the authentication token provider
   */
  setAuthTokenProvider(provider: () => string | null): void {
    this.getAuthToken = provider;
  }

  /**
   * Set the unauthorized callback (for token refresh)
   */
  setUnauthorizedHandler(handler: () => Promise<boolean>): void {
    this.onUnauthorized = handler;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Build headers for request
   */
  private buildHeaders(options: ApiRequestConfig): Headers {
    const headers = new Headers(options.headers);

    // Set Content-Type if body is present and not FormData
    if (options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Add auth token if available
    const token = this.getAuthToken?.();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Create an API error from response
   */
  private async createError(response: Response): Promise<ApiError> {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const error = new Error(
      (data as any)?.message ||
      (data as any)?.error ||
      response.statusText ||
      'Request failed'
    ) as ApiError;

    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;

    return error;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = config;
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(fetchOptions);

    let response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include',
    });

    // Handle 401 with token refresh
    if (response.status === 401 && this.onUnauthorized) {
      const refreshed = await this.onUnauthorized();

      if (refreshed) {
        // Retry with new token
        const newHeaders = this.buildHeaders(fetchOptions);
        response = await fetch(url, {
          ...fetchOptions,
          headers: newHeaders,
          credentials: 'include',
        });
      }
    }

    if (!response.ok) {
      throw await this.createError(response);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Get raw response (useful for file downloads, etc.)
   */
  async getRaw(endpoint: string, config?: ApiRequestConfig): Promise<Response> {
    const { params, ...fetchOptions } = config || {};
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(fetchOptions);

    return fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include',
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
