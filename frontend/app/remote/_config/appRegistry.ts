import type { ComponentType } from 'react';
import {
  RemoteApp,
  ListsApp,
  GalleryApp,
  ScheduleApp,
  PollsApp,
  CustomApiApp,
  DefaultApp,
  GuestbookApp,
} from '../_components/apps';
import type { BaseAppProps } from '../_components/apps/types';

export const APP_COMPONENTS: Record<string, ComponentType<BaseAppProps>> = {
  remote: RemoteApp,
  lists: ListsApp,
  gallery: GalleryApp,
  schedule: ScheduleApp,
  polls: PollsApp,
  custom: CustomApiApp,
  guestbook: GuestbookApp,
};

export function getAppComponent(type: string): ComponentType<BaseAppProps> {
  return APP_COMPONENTS[type] || DefaultApp;
}
