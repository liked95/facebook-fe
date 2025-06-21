export interface UserMetaProps {
  username: string | null;
  meta?: React.ReactNode;
  className?: string;
}

export function UserMeta({ username, meta, className = '' }: UserMetaProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[13px] font-bold text-base text-[#232946] dark:text-[#E4E6EB] truncate">{username}</span>
        {meta}
      </div>
    </div>
  );
} 