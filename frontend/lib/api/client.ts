import { getAuthApiUrl } from '@/utils/urls';
import { BaseApiClient } from './base';
import { ApiError, RequestConfig } from './types';

// ============================================================================
// Types
// ============================================================================

type AuthTokenProvider = () => string | null;
type UnauthorizedHandler = () => Promise<boolean>;

// ============================================================================
// Authenticated API Client
// ============================================================================

export class ApiClient extends BaseApiClient {
  private authTokenProvider: AuthTokenProvider | null = null;
  private unauthorizedHandler: UnauthorizedHandler | null = null;

  constructor(baseUrl: string = getAuthApiUrl()) {
    super(baseUrl);
  }

  // --------------------------------------------------------------------------
  // Auth Configuration
  // --------------------------------------------------------------------------

  setAuthTokenProvider(provider: AuthTokenProvider): void {
    this.authTokenProvider = provider;
  }

  setUnauthorizedHandler(handler: UnauthorizedHandler): void {
    this.unauthorizedHandler = handler;
  }

  // --------------------------------------------------------------------------
  // Override Headers to Include Auth
  // --------------------------------------------------------------------------

  protected override buildHeaders(
    existingHeaders?: HeadersInit,
    isFormData = false
  ): Headers {
    const headers = super.buildHeaders(existingHeaders, isFormData);

    const token = this.authTokenProvider?.();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // --------------------------------------------------------------------------
  // Override Request Execution for 401 Handling
  // --------------------------------------------------------------------------

  protected override async executeRequest<T>(
    url: string,
    config: RequestInit,
    timeout?: number
  ): Promise<T> {
    try {
      return await super.executeRequest<T>(url, { ...config, credentials: 'include' }, timeout);
    } catch (error) {
      // Handle 401 with token refresh
      if (ApiError.isApiError(error) && error.status === 401 && this.unauthorizedHandler) {
        const refreshed = await this.unauthorizedHandler();

        if (refreshed) {
          // Rebuild headers with new token
          const isFormData = config.body instanceof FormData;
          const newHeaders = this.buildHeaders(undefined, isFormData);

          return super.executeRequest<T>(
            url,
            { ...config, headers: newHeaders, credentials: 'include' },
            timeout
          );
        }
      }

      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Raw Response Method (for downloads, etc.)
  // --------------------------------------------------------------------------

  async getRaw(endpoint: string, config?: RequestConfig): Promise<Response> {
    const url = this.buildUrl(endpoint, config?.params);
    const headers = this.buildHeaders(config?.headers);

    return fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
      signal: config?.signal,
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const apiClient = new ApiClient();
