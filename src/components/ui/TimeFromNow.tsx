import { formatTimeAgoShort } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";

export interface TimeFromNowProps {
  date: string | Date;
  className?: string;
  onClick?: () => void;
}

export function TimeFromNow({ date, className = "", onClick }: TimeFromNowProps) {
  // Parse the ISO string directly without timezone conversion
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const nowUtc = toZonedTime(new Date(), 'UTC');
  const timeAgo = formatTimeAgoShort(parsedDate, nowUtc);

  return (
    <span 
      className={`hover:underline cursor-pointer ${className}`}
      onClick={onClick}
    >
      {timeAgo}
    </span>
  );
} 