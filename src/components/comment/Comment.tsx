import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { Button } from "../ui/Button";
import { UserResponseDto, CommentResponseDto } from "@/types/api";
import { CommentReplyInput } from "./CommentReplyInput";
import { useReplies } from "../../hooks/queries/useComments";
import placeholderUserAvatar from "@/assets/images/placeholder_user_avatar.png";
import likeIcon from "@/assets/images/like.svg";
import { TimeFromNow } from "../ui/TimeFromNow";

const MAX_REPLY_LEVEL = 10;

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
  isLastReply?: boolean;
  isFirstReply?: boolean;
  isLeaf?: boolean;
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
  level = 0,
  isLastReply,
  isLeaf,
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

  return (
    <li className="relative">
      {/* Connector lines for replies */}
      {level > 0 && (
        <>
          {/* Vertical line */}
          <div
            className={`absolute -left-4 w-0.5 bg-gray-300 dark:bg-gray-600 
               
              ${isLastReply ? "h-5" : "h-[calc(100%+1rem)]"}`}
          ></div>
          {/* Horizontal line */}
          <div className="absolute -left-4 top-5 h-0.5 w-7 bg-gray-300 dark:bg-gray-600"></div>
        </>
      )}

      <div
        className={`flex items-start gap-2 ${
          showReplies && replies && replies.length > 0 ? "pb-4" : ""
        }`}
      >
        {/* Vertical line */}
        {!isLeaf && (
          <div
            className={`relative  w-0.5 bg-gray-300 dark:bg-gray-600 
              left-6 
              top-9
              h-24
              `}
          ></div>
        )}
        <Avatar
          src={comment.userAvatarUrl || placeholderUserAvatar}
          alt={comment.username || "User"}
          size={32}
          className="mt-1 shrink-0 z-10"
        />
        <div className="flex-1">
          <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-md px-3 py-2">
            <UserMeta
              username={comment.username || "Unknown"}
              className="mb-1"
            />
            <div className="text-[15px] text-[#050505] dark:text-[#E4E6EB] mt-1 whitespace-pre-line">
              {comment.content}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2 px-2 text-xs text-[#65676B] dark:text-[#B0B3B8]">
              <TimeFromNow date={comment.createdAt} />
              <Button
                variant="ghost"
                className={`h-6 p-0 font-bold text-xs hover:bg-transparent hover:underline ${
                  comment.isLikedByCurrentUser 
                    ? "text-[#1877F2] dark:text-[#1877F2]" 
                    : "text-[#65676B] dark:text-[#B0B3B8]"
                }`}
                onClick={() => onLike(comment.id)}
                disabled={isLiking}
              >
                Like
              </Button>

              {level < MAX_REPLY_LEVEL && (
                <Button
                  variant="ghost"
                  className="h-6 p-0 font-bold text-xs text-[#65676B] dark:text-[#B0B3B8] hover:bg-transparent hover:underline"
                  onClick={() => setShowReplyInput(true)}
                >
                  Reply
                </Button>
              )}

              {comment.userId === currentUser.id && (
                <Button
                  variant="ghost"
                  className="h-6 p-0 font-bold text-xs text-[#65676B] dark:text-[#B0B3B8] hover:bg-transparent hover:underline"
                  onClick={() => onDelete(comment.id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {comment.likesCount > 0 && (
                <>
                  <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                    {comment.likesCount}
                  </span>
                  <img src={likeIcon} alt="like icon" className="w-4 h-4" />
                </>
              )}
            </div>
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
            <>
              <div className="relative -left-6 top-5 h-0.5 w-5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="mt-2">
                {/* Horizontal line */}
                <Button
                  variant="ghost"
                  className="h-6 p-0 text-xs text-[#1877F2] dark:text-[#1877F2] hover:bg-transparent"
                  onClick={handleViewReplies}
                >
                  View {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Show replies when loaded */}
      {showReplies && (
        <div className="ml-10">
          {loadingReplies ? (
            <div className="text-xs text-[#65676B] dark:text-[#B0B3B8] py-2">
              Loading replies...
            </div>
          ) : replies && replies.length > 0 ? (
            <ul className="space-y-4">
              {replies.map((reply, index) => (
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
                  isFirstReply={index === 0}
                  isLastReply={index === replies.length - 1}
                  isLeaf={reply.replyCount === 0}
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
    </li>
  );
}
