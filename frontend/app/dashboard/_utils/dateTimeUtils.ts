import { setHours, setMinutes } from 'date-fns';

export function combineDateAndTime(date: Date | undefined, time: string): Date | null {
  if (!date) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return setMinutes(setHours(date, hours), minutes);
}
