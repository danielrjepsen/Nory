'use client';

import { useEffect, useReducer, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Activity } from '../_types';

const EXPIRY_MS = 2 * 60 * 1000;
const MAX_VISIBLE = 4;
const REFRESH_MS = 10_000;
const MS_PER_MINUTE = 60_000;

function useForceUpdate(intervalMs: number) {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const id = setInterval(forceUpdate, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

function filterActivities(activities: Activity[], expiryMs: number, maxVisible: number) {
  if (!activities?.length) return { visible: [] as Activity[], overflow: 0 };

  const cutoff = Date.now() - expiryMs;
  const valid = activities
    .filter((a) => a?.timestamp && a.timestamp > cutoff)
    .sort((a, b) => a.timestamp - b.timestamp);

  return { visible: valid.slice(-maxVisible), overflow: Math.max(0, valid.length - maxVisible) };
}

interface Props {
  activities: Activity[];
  maxVisible?: number;
  expiryMs?: number;
}

function ActivityFeedInner({ activities, maxVisible = MAX_VISIBLE, expiryMs = EXPIRY_MS }: Props) {
  useForceUpdate(REFRESH_MS);

  const { visible, overflow } = filterActivities(activities, expiryMs, maxVisible);
  if (!visible.length) return null;

  return (
    <div className="absolute top-4 right-4 z-50 space-y-3 max-w-sm">
      {visible.map((activity, i) => (
        <ActivityItem key={activity.id} activity={activity} isNewest={i === visible.length - 1} expiryMs={expiryMs} />
      ))}
      {overflow > 0 && <OverflowBadge count={overflow} />}
    </div>
  );
}

interface ItemProps {
  activity: Activity;
  isNewest: boolean;
  expiryMs: number;
}

const ActivityItem = memo(function ActivityItem({ activity, isNewest, expiryMs }: ItemProps) {
  const { t } = useTranslation('slideshow');
  const age = (Date.now() - activity.timestamp) / MS_PER_MINUTE;
  const opacity = Math.max(0.4, 1 - age / (expiryMs / MS_PER_MINUTE));
  const time = new Date(activity.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`transform transition-all duration-500 ease-out text-white px-4 py-3 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:scale-105 ${isNewest ? 'animate-slide-in-right' : ''}`}
      style={{ opacity }}
    >
      <div className="text-sm font-bold text-center mb-1">{activity.message}</div>
      <div className="text-xs opacity-75 text-center flex items-center justify-center gap-2">
        <span className="font-medium">{activity.userName}</span>
        <span>•</span>
        <span>{time}</span>
        <span className="text-xs opacity-50">{t('display.activityFeed.minutesAgo', { minutes: Math.floor(age) })}</span>
      </div>
    </div>
  );
});

const OverflowBadge = memo(function OverflowBadge({ count }: { count: number }) {
  const { t } = useTranslation('slideshow');
  return (
    <div className="text-center">
      <span className="inline-block text-white text-xs px-3 py-1 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
        {t('display.activityFeed.moreActivities', { count })}
      </span>
    </div>
  );
});

export const ActivityFeed = memo(ActivityFeedInner);
