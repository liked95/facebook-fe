import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { Button } from "../ui/Button";
import { UserResponseDto, CommentResponseDto } from "@/types/api";
import { CommentReplyInput } from "./CommentReplyInput";
import { useReplies } from "../../hooks/queries/useComments";
import placeholderUserAvatar from "@/assets/images/placeholder_user_avatar.png";

export interface CommentProps {
  comment: CommentResponseDto;
  onLike: (commentId: string) => void;
  isLiking: boolean;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
  currentUser: UserResponseDto;
  onReply: (commentId: string, content: string) => void;
  isReplying: boolean;
  postId: string;
  level?: number;
}

export function Comment({ 
  comment, 
  onLike, 
  isLiking, 
  onDelete, 
  isDeleting, 
  currentUser,
  onReply,
  isReplying,
  postId,
  level = 0 
}: CommentProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const { data: replies, isLoading: loadingReplies } = useReplies(
    showReplies ? postId : undefined,
    showReplies ? comment.id : undefined
  );

  const handleReply = (content: string) => {
    onReply(comment.id, content);
    setShowReplyInput(false);
  };

  const handleViewReplies = () => {
    setShowReplies(true);
  };

  const maxLevel = 2; // Maximum nesting level (0, 1, 2 = 3 levels total)

  return (
    <li className={`flex items-start gap-2 ${level > 0 ? 'ml-10' : ''}`}>
      <Avatar
        src={comment.userAvatarUrl || placeholderUserAvatar}
        alt={comment.username || "User"}
        size={32}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-md px-3 py-2">
          <UserMeta
            username={comment.username || "Unknown"}
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

            {level < maxLevel && (
              <Button
                variant="ghost"
                className="h-6 p-0 text-xs text-[#65676B] dark:text-[#B0B3B8] hover:bg-transparent"
                onClick={() => setShowReplyInput(true)}
              >
                Reply
              </Button>
            )}
          </div>

          {comment.userId === currentUser.id && (
            <div>
              <Button
                variant="ghost"
                className="h-6 p-0 text-xs text-[#e62e2e] dark:text-[#e62e2e] hover:bg-transparent"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {showReplyInput && (
          <div className="mt-2">
            <CommentReplyInput
              currentUser={currentUser}
              onSubmit={handleReply}
              onCancel={() => setShowReplyInput(false)}
              loading={isReplying}
              replyingTo={comment.username || "Unknown"}
            />
          </div>
        )}

        {/* Show "View Replies" button if there are replies */}
        {comment.replyCount > 0 && !showReplies && (
          <div className="mt-2">
            <Button
              variant="ghost"
              className="h-6 p-0 text-xs text-[#1877F2] dark:text-[#1877F2] hover:bg-transparent"
              onClick={handleViewReplies}
            >
              View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </Button>
          </div>
        )}

        {/* Show replies when loaded */}
        {showReplies && (
          <div className="mt-2">
            {loadingReplies ? (
              <div className="text-xs text-[#65676B] dark:text-[#B0B3B8] py-2">
                Loading replies...
              </div>
            ) : replies && replies.length > 0 ? (
              <ul className="space-y-4">
                {replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    onLike={onLike}
                    isLiking={isLiking}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                    currentUser={currentUser}
                    onReply={onReply}
                    isReplying={isReplying}
                    postId={postId}
                    level={level + 1}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-xs text-[#65676B] dark:text-[#B0B3B8] py-2">
                No replies yet
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
