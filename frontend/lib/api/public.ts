import { getApiUrl } from '@/utils/urls';
import { BaseApiClient } from './base';

// ============================================================================
// Public API Client (No Authentication)
// ============================================================================

export class PublicApiClient extends BaseApiClient {
  constructor(baseUrl: string = getApiUrl()) {
    super(baseUrl);
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const publicApi = new PublicApiClient();
