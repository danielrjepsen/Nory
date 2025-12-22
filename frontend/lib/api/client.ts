import { getAuthApiUrl } from '@/utils/urls';
import { BaseApiClient } from './base';
import { RequestConfig } from './types';

export class ApiClient extends BaseApiClient {
  constructor(baseUrl: string = getAuthApiUrl()) {
    super(baseUrl);
  }

  protected override async executeRequest<T>(
    url: string,
    config: RequestInit,
    timeout?: number
  ): Promise<T> {
    return super.executeRequest<T>(url, { ...config, credentials: 'include' }, timeout);
  }

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

export const apiClient = new ApiClient();
