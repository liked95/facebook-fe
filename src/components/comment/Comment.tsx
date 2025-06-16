import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { Button } from "../ui/Button";
import { CommentResponseDto, UserResponseDto } from "@/types/api";
import placeholderUserAvatar from "@/assets/images/placeholder_user_avatar.png";

export interface CommentProps {
  comment: CommentResponseDto;
  onLike: (commentId: string) => void;
  isLiking: boolean;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
  currentUser: UserResponseDto;
}

export function Comment({ comment, onLike, isLiking, onDelete, isDeleting, currentUser }: CommentProps) {
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

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <Button
              variant="ghost"
              className={`h-6 p-0 text-xs text-[#65676B] dark:text-[#B0B3B8] hover:bg-transparent hover:text-[#1877F2] dark:hover:text-[#1877F2] ${
                comment.isLikedByCurrentUser ? "text-[#1877F2]" : ""
              }`}
              onClick={() => onLike(comment.id)}
              disabled={isLiking}
            >
              Like
            </Button>

            <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              {comment.likesCount} likes
            </span>

            <Button
              variant="ghost"
              className="h-6 p-0 text-xs text-[#65676B] dark:text-[#B0B3B8] hover:bg-transparent"
            >
              Reply
            </Button>
          </div>

          {comment.userId === currentUser.id && <div>
            <Button
              variant="ghost"
              className="h-6 p-0 text-xs text-[#e62e2e] dark:text-[#e62e2e] hover:bg-transparent"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>}
        </div>
      </div>
    </li>
  );
}
