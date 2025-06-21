import { formatDistance } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export interface UserMetaProps {
  username: string | null;
  createdAt: string;
  meta?: React.ReactNode;
  className?: string;
}

export function UserMeta({ username, createdAt, meta, className = '' }: UserMetaProps) {
  // Parse the ISO string directly without timezone conversion
  const date = new Date(createdAt);
  const nowUtc = toZonedTime(new Date(), 'UTC');
  
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[13px] font-bold text-base text-[#232946] dark:text-[#E4E6EB] truncate">{username}</span>
        {meta}
      </div>
      <div className="flex items-center gap-1 text-xs text-[#8A8D91] dark:text-[#A3BCF9] mt-0.5 font-medium">
        <span>{formatDistance(date, nowUtc, { addSuffix: true })}</span>
        <span>·</span>
        <span>🌐</span>
      </div>
    </div>
  );
} 