import { Avatar } from '../ui/Avatar';
import { UserMeta } from '../ui/UserMeta';

export interface CommentProps {
  comment: {
    id: string;
    content: string | null;
    createdAt: string;
    username: string | null;
    userAvatarUrl: string | null;
  };
}

export function Comment({ comment }: CommentProps) {
  return (
    <li className="flex items-start gap-2">
      <Avatar src={comment.userAvatarUrl} alt={comment.username || 'User'} size={32} className="mt-1" />
      <div className="flex-1">
        <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-md px-3 py-2">
          <UserMeta username={comment.username} createdAt={comment.createdAt} className="mb-1" />
          <div className="text-sm text-[#050505] dark:text-[#E4E6EB] mt-1 whitespace-pre-line">{comment.content}</div>
        </div>
      </div>
    </li>
  );
} 