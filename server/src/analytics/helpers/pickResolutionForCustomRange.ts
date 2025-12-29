import { MS_DAY, Resolution } from '../analytics.types';

export const pickResolutionForCustomRange = (
  from: Date,
  to: Date,
): Resolution => {
  const spanDays = Math.ceil((to.getTime() - from.getTime()) / MS_DAY);

  // <= ~2 months
  if (spanDays <= 62) return 'day';
  // 2-4 months
  if (spanDays <= 124) return 'week';
  // >4 months
  return 'month';
};
