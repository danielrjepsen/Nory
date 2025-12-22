'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  getBackupConfiguration,
  configureBackup,
  updateBackupConfiguration,
  deleteBackupConfiguration,
  testBackupConnection,
  runBackup,
  getBackupHistory,
  type BackupConfiguration,
  type BackupHistory,
  type TestConnectionResult,
  type BackupRunResult,
} from '../../_services/backup';

export function useBackupSettings() {
  const [configuration, setConfiguration] = useState<BackupConfiguration | null>(null);
  const [history, setHistory] = useState<BackupHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);
  const [testing, setTesting] = useState(false);
  const [runningBackup, setRunningBackup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);
  const [backupResult, setBackupResult] = useState<BackupRunResult | null>(null);

  const fetchConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      const config = await getBackupConfiguration();
      setConfiguration(config);

      if (config) {
        const hist = await getBackupHistory(5);
        setHistory(hist);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  const configure = useCallback(async (
    schedule: 'daily' | 'weekly',
    folderName: string,
    serviceAccountFile: File
  ): Promise<boolean> => {
    try {
      setConfiguring(true);
      setError(null);
      const config = await configureBackup(schedule, folderName, serviceAccountFile);
      setConfiguration(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to configure backup');
      return false;
    } finally {
      setConfiguring(false);
    }
  }, []);

  const update = useCallback(async (
    schedule?: 'daily' | 'weekly',
    folderName?: string
  ): Promise<boolean> => {
    try {
      setConfiguring(true);
      setError(null);
      const config = await updateBackupConfiguration(schedule, folderName);
      setConfiguration(config);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update backup');
      return false;
    } finally {
      setConfiguring(false);
    }
  }, []);

  const remove = useCallback(async (): Promise<boolean> => {
    try {
      setConfiguring(true);
      setError(null);
      await deleteBackupConfiguration();
      setConfiguration(null);
      setHistory([]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete backup configuration');
      return false;
    } finally {
      setConfiguring(false);
    }
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      setTesting(true);
      setError(null);
      setTestResult(null);
      const result = await testBackupConnection();
      setTestResult(result);
      return result.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connection');
      return false;
    } finally {
      setTesting(false);
    }
  }, []);

  const triggerBackup = useCallback(async (): Promise<boolean> => {
    try {
      setRunningBackup(true);
      setError(null);
      setBackupResult(null);
      const result = await runBackup();
      setBackupResult(result);
      await fetchConfiguration();

      return result.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run backup');
      return false;
    } finally {
      setRunningBackup(false);
    }
  }, [fetchConfiguration]);

  const clearMessages = useCallback(() => {
    setError(null);
    setTestResult(null);
    setBackupResult(null);
  }, []);

  return {
    configuration,
    history,
    loading,
    configuring,
    testing,
    runningBackup,
    error,
    testResult,
    backupResult,
    configure,
    update,
    remove,
    testConnection,
    triggerBackup,
    clearMessages,
    refresh: fetchConfiguration,
  };
}
