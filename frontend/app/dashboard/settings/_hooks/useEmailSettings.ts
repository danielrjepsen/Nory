'use client';

import { useState, useEffect, useCallback } from 'react';
import * as emailApi from '../../_services/email';

interface EmailConfiguration {
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

interface TestResult {
  success: boolean;
  error?: string;
}

export function useEmailSettings() {
  const [configuration, setConfiguration] = useState<EmailConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const fetchConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      const data = await emailApi.getEmailConfiguration();
      setConfiguration(data);
    } catch (err) {
      console.error('Failed to fetch email configuration:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  const configure = useCallback(async (data: emailApi.ConfigureEmailRequest): Promise<boolean> => {
    setConfiguring(true);
    setError(null);
    try {
      const result = await emailApi.configureEmail(data);
      setConfiguration(result);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to configure email');
      return false;
    } finally {
      setConfiguring(false);
    }
  }, []);

  const remove = useCallback(async (): Promise<boolean> => {
    setConfiguring(true);
    setError(null);
    try {
      await emailApi.deleteEmailConfiguration();
      setConfiguration(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove email configuration');
      return false;
    } finally {
      setConfiguring(false);
    }
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    setTesting(true);
    setTestResult(null);
    setError(null);
    try {
      await emailApi.testEmailConnection();
      setTestResult({ success: true });
      await fetchConfiguration();
      return true;
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : 'Connection test failed'
      });
      await fetchConfiguration();
      return false;
    } finally {
      setTesting(false);
    }
  }, [fetchConfiguration]);

  const clearMessages = useCallback(() => {
    setError(null);
    setTestResult(null);
  }, []);

  return {
    configuration,
    loading,
    configuring,
    testing,
    error,
    testResult,
    configure,
    remove,
    testConnection,
    clearMessages,
    refetch: fetchConfiguration,
  };
}
