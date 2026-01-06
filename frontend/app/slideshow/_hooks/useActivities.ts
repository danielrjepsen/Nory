'use client';

import { useState, useCallback } from 'react';
import type { Activity, ActivityType } from '../_types';
import { Limits } from '../_constants';

interface UseActivitiesReturn {
  activities: Activity[];
  addActivity: (type: ActivityType, message: string, userName?: string) => void;
  clearActivities: () => void;
}

export function useActivities(): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = useCallback((type: ActivityType, message: string, userName = 'System') => {
    const activity: Activity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      message,
      userName,
      timestamp: Date.now(),
    };
    setActivities((prev) => [...prev, activity].slice(-Limits.MAX_ACTIVITIES));
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  return {
    activities,
    addActivity,
    clearActivities,
  };
}
