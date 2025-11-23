/**
 * Get the correct events URL based on environment
 * In development: uses localhost:3001 (slideshow port)
 * In production: uses the configured URL or production domain
 */
export function getEventsUrl(): string {
  // If explicitly set, use that
  if (process.env.NEXT_PUBLIC_EVENTS_URL) {
    return process.env.NEXT_PUBLIC_EVENTS_URL;
  }
  
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // Production fallback
  return 'https://events.usenory.com';
}

/**
 * Get the correct API URL based on environment
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8888';
  }
  
  return 'https://api.usenory.com';
}

/**
 * Get the correct dashboard URL based on environment
 */
export function getDashboardUrl(): string {
  if (process.env.NEXT_PUBLIC_DASHBOARD_URL) {
    return process.env.NEXT_PUBLIC_DASHBOARD_URL;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3002';
  }
  
  return 'https://app.usenory.com';
}

/**
 * Get the correct auth service URL based on environment
 * Uses dedicated auth subdomain for shared cookie authentication across all services
 */
export function getAuthUrl(): string {
  if (process.env.NEXT_PUBLIC_AUTH_URL) {
    return process.env.NEXT_PUBLIC_AUTH_URL;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return typeof window !== 'undefined' 
      ? `${window.location.protocol}//auth.nory.local:8443`
      : 'https://auth.nory.local:8443';
  }
  
  // In production, use the dedicated auth subdomain for shared authentication
  return 'https://auth.usenory.com';
}

/**
 * Get the correct API base URL for auth service calls
 */
export function getAuthApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return typeof window !== 'undefined' 
      ? 'https://api.nory.local:8443'
      : 'http://backend:5000';
  }
  
  return 'https://api.usenory.com';
}