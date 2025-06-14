import { formatDistanceToNow } from 'date-fns';

export interface UserMetaProps {
  username: string | null;
  createdAt: string;
  meta?: React.ReactNode;
  className?: string;
}

export function UserMeta({ username, createdAt, meta, className = '' }: UserMetaProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">{username}</span>
        {meta}
      </div>
      <div className="flex items-center gap-1 text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        <span>·</span>
        <span>🌐</span>
      </div>
    </div>
  );
} 