const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5089';

export interface ConfigureEmailRequest {
  provider: number;
  smtpHost: string;
  smtpPort: number;
  useSsl: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailConfiguration {
  isEnabled: boolean;
  provider: number;
  smtpHost: string;
  smtpPort: number;
  useSsl: boolean;
  username: string;
  fromEmail: string;
  fromName: string;
  lastTestedAt: string | null;
  lastTestSuccessful: boolean | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || data.errors?.[0] || `Request failed: ${response.status}`);
  }
  return response.json();
}

export async function getEmailConfiguration(): Promise<EmailConfiguration | null> {
  const response = await fetch(`${API_BASE}/api/v1/email/config`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    return null;
  }

  return handleResponse<EmailConfiguration>(response);
}

export async function configureEmail(data: ConfigureEmailRequest): Promise<EmailConfiguration> {
  const response = await fetch(`${API_BASE}/api/v1/email/config`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<EmailConfiguration>(response);
}

export async function deleteEmailConfiguration(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/email/config`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
}

export async function testEmailConnection(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/email/test`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Test failed: ${response.status}`);
  }
}
