import { Resolution } from '../analytics.types';
import {
  toDayKey,
  toHourKey,
  toMonthKey,
  toWeekdayKey,
  toWeekRangeKey,
} from './toKey';

export const keyForResolution = (d: Date, res: Resolution) => {
  if (res === 'hour') return toHourKey(d);
  if (res === 'weekday') return toWeekdayKey(d);
  if (res === 'day') return toDayKey(d);
  if (res === 'week') return toWeekRangeKey(d);
  return toMonthKey(d);
};
