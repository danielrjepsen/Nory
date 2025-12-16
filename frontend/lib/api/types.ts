// ============================================================================
// Request Types
// ============================================================================

export type RequestParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestConfig {
  params?: RequestParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeout?: number;
}

export interface ApiRequestConfig extends RequestConfig {
  body?: BodyInit | null;
  method?: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ApiErrorData {
  message?: string;
  error?: string;
  code?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: ApiErrorData | null;
  readonly isApiError = true;

  constructor(
    message: string,
    status: number,
    statusText: string,
    data: ApiErrorData | null = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError || (error as ApiError)?.isApiError === true;
  }
}

// ============================================================================
// Interceptor Types
// ============================================================================

export type RequestInterceptor = (
  url: string,
  config: RequestInit
) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

export interface Interceptors {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
}
