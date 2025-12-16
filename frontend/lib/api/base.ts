import {
  ApiError,
  ApiErrorData,
  RequestConfig,
  RequestParams,
  Interceptors,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './types';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TIMEOUT = 30_000; // 30 seconds

// ============================================================================
// Base API Client
// ============================================================================

export abstract class BaseApiClient {
  protected readonly baseUrl: string;
  protected readonly interceptors: Interceptors = {
    request: [],
    response: [],
    error: [],
  };

  constructor(baseUrl: string) {
    // Remove trailing slash for consistency
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // --------------------------------------------------------------------------
  // Interceptor Management
  // --------------------------------------------------------------------------

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index > -1) this.interceptors.request.splice(index, 1);
    };
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index > -1) this.interceptors.response.splice(index, 1);
    };
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.interceptors.error.push(interceptor);
    return () => {
      const index = this.interceptors.error.indexOf(interceptor);
      if (index > -1) this.interceptors.error.splice(index, 1);
    };
  }

  // --------------------------------------------------------------------------
  // URL Building
  // --------------------------------------------------------------------------

  protected buildUrl(endpoint: string, params?: RequestParams): string {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${normalizedEndpoint}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value != null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  // --------------------------------------------------------------------------
  // Headers
  // --------------------------------------------------------------------------

  protected buildHeaders(
    existingHeaders?: HeadersInit,
    isFormData = false
  ): Headers {
    const headers = new Headers(existingHeaders);

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  // --------------------------------------------------------------------------
  // Response Handling
  // --------------------------------------------------------------------------

  protected async parseResponseBody<T>(response: Response): Promise<T | null> {
    const contentType = response.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
      return null;
    }

    const text = await response.text();
    if (!text) return null;

    return JSON.parse(text) as T;
  }

  protected async createApiError(response: Response): Promise<ApiError> {
    let data: ApiErrorData | null = null;

    try {
      const parsed = await this.parseResponseBody<ApiErrorData>(response);
      if (parsed && typeof parsed === 'object') {
        data = parsed;
      }
    } catch {
      // Failed to parse error body
    }

    const message = data?.message ?? data?.error ?? response.statusText ?? 'Request failed';

    return new ApiError(message, response.status, response.statusText, data);
  }

  // --------------------------------------------------------------------------
  // Request Execution
  // --------------------------------------------------------------------------

  protected async executeRequest<T>(
    url: string,
    config: RequestInit,
    timeout?: number
  ): Promise<T> {
    // Apply request interceptors
    let finalConfig = config;
    for (const interceptor of this.interceptors.request) {
      finalConfig = await interceptor(url, finalConfig);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeout ?? DEFAULT_TIMEOUT
    );

    // Merge signals if one was provided
    const existingSignal = finalConfig.signal;
    if (existingSignal) {
      existingSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      let response = await fetch(url, {
        ...finalConfig,
        signal: controller.signal,
      });

      // Apply response interceptors
      for (const interceptor of this.interceptors.response) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        throw await this.createApiError(response);
      }

      const body = await this.parseResponseBody<T>(response);
      return body as T;
    } catch (error) {
      if (error instanceof ApiError) {
        // Apply error interceptors
        let finalError = error;
        for (const interceptor of this.interceptors.error) {
          finalError = await interceptor(finalError);
        }
        throw finalError;
      }

      // Handle abort errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // --------------------------------------------------------------------------
  // HTTP Methods
  // --------------------------------------------------------------------------

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const headers = this.buildHeaders(config?.headers);

    return this.executeRequest<T>(
      url,
      { method: 'GET', headers },
      config?.timeout
    );
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const isFormData = data instanceof FormData;
    const headers = this.buildHeaders(config?.headers, isFormData);
    const body = isFormData ? data : JSON.stringify(data);

    return this.executeRequest<T>(
      url,
      { method: 'POST', headers, body },
      config?.timeout
    );
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const isFormData = data instanceof FormData;
    const headers = this.buildHeaders(config?.headers, isFormData);
    const body = isFormData ? data : JSON.stringify(data);

    return this.executeRequest<T>(
      url,
      { method: 'PUT', headers, body },
      config?.timeout
    );
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const isFormData = data instanceof FormData;
    const headers = this.buildHeaders(config?.headers, isFormData);
    const body = isFormData ? data : JSON.stringify(data);

    return this.executeRequest<T>(
      url,
      { method: 'PATCH', headers, body },
      config?.timeout
    );
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const headers = this.buildHeaders(config?.headers);

    return this.executeRequest<T>(
      url,
      { method: 'DELETE', headers },
      config?.timeout
    );
  }
}
