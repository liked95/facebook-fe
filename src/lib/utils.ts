import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNowStrict, formatDistanceStrict } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgoShort(date: Date, baseDate?: Date): string {
  const distance = baseDate 
    ? formatDistanceStrict(date, baseDate, { addSuffix: false })
    : formatDistanceToNowStrict(date, { addSuffix: false });
    
  const [value, unit] = distance.split(' ');

  switch (unit) {
    case 'second':
    case 'seconds':
      return `${value}s`;
    case 'minute':
    case 'minutes':
      return `${value}m`;
    case 'hour':
    case 'hours':
      return `${value}h`;
    case 'day':
    case 'days':
      return `${value}d`;
    case 'month':
    case 'months':
      // date-fns uses 'month', so we need to handle it. 
      // It's more than 4 weeks, so 'w' isn't appropriate.
      // Let's use 'mo' for month.
      return `${value}mo`;
    case 'year':
    case 'years':
      return `${value}y`;
    default:
      // This part handles cases like 'about a minute' etc.
      // We can add more specific cases if needed.
      // For now, let's keep it simple.
      return distance;
  }
} 