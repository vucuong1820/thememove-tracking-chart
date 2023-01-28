import { TIME_ZONE } from '@constants';
import { endOfDay, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export default function formatStartEndDate(date) {
  if (!date?.start || !date?.end) return date;
  return {
    start: zonedTimeToUtc(startOfDay(date.start), TIME_ZONE),
    end: zonedTimeToUtc(endOfDay(date.end), TIME_ZONE),
  };
}
