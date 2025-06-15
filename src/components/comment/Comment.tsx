import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { CommentResponseDto } from "@/types/api";
import placeholderUserAvatar from "@/assets/images/placeholder_user_avatar.png";

export interface CommentProps {
  comment: CommentResponseDto;
}

export function Comment({ comment }: CommentProps) {
  return (
    <li className="flex items-start gap-2">
      <Avatar
        src={comment.userAvatarUrl || placeholderUserAvatar}
        alt={comment.username || "User"}
        size={32}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-md px-3 py-2">
          <UserMeta
            username={comment.username}
            createdAt={comment.createdAt}
            className="mb-1"
          />
          <div className="text-sm text-[#050505] dark:text-[#E4E6EB] mt-1 whitespace-pre-line">
            {comment.content}
          </div>
        </div>
      </div>
    </li>
  );
}
