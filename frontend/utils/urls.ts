export function getEventsUrl(): string {
  if (process.env.NEXT_PUBLIC_EVENTS_URL) {
    return process.env.NEXT_PUBLIC_EVENTS_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3002';
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//events.${hostname}`;
  }

  return 'http://localhost:3002';
}

export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5001';
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5001';
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:5001';
}

export function getDashboardUrl(): string {
  if (process.env.NEXT_PUBLIC_DASHBOARD_URL) {
    return process.env.NEXT_PUBLIC_DASHBOARD_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3002';
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3002';
}

export function getAuthUrl(): string {
  return getApiUrl();
}

export function getAuthApiUrl(): string {
  return getApiUrl();
}
