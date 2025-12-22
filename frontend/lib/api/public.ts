import { getApiUrl } from '@/utils/urls';
import { BaseApiClient } from './base';

export class PublicApiClient extends BaseApiClient {
  constructor(baseUrl: string = getApiUrl()) {
    super(baseUrl);
  }

  protected override async executeRequest<T>(
    url: string,
    config: RequestInit,
    timeout?: number
  ): Promise<T> {
    return super.executeRequest<T>(url, { ...config, credentials: 'include' }, timeout);
  }
}

export const publicApi = new PublicApiClient();
