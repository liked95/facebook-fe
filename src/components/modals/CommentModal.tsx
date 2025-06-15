import { Modal } from "./Modal";
import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { Button } from "../ui/Button";
import { CommentList } from "../comment/CommentList";
import { CommentInput } from "../comment/CommentInput";
import placeholderUserAvatar from "../../assets/images/placeholder_user_avatar.png";
import type { PostResponseDto, UserResponseDto, CommentResponseDto } from "../../types/api";

interface PostDetailModalProps {
  post: PostResponseDto | null;
  onClose: () => void;
  currentUser: UserResponseDto;
  commentsData: CommentResponseDto[];
  commentsLoading: boolean;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  addCommentLoading: boolean;
  addCommentError: string;
}

export function PostDetailModal({
  post,
  onClose,
  currentUser,
  commentsData,
  commentsLoading,
  commentText,
  onCommentTextChange,
  onAddComment,
  addCommentLoading,
  addCommentError,
}: PostDetailModalProps) {
  if (!post) return null;

  return (
    <Modal open={!!post} onClose={onClose} widthClassName="max-w-2xl">
      {/* Post content (no footer) */}
      <div className="p-4 border-b border-[#e3e8f0] dark:border-[#2a2d34]">
        <div className="flex flex-row items-center gap-4 mb-2">
          <Avatar
            src={post.userAvatarUrl}
            alt={post.username || "User"}
            size={48}
          />
          <UserMeta
            username={post.username}
            createdAt={post.createdAt}
          />
        </div>
        {post.content && (
          <div className="mb-4 text-lg text-[#232946] dark:text-[#E4E6EB] whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        )}
        {post.imageUrl && (
          <div className="flex gap-3 mb-2">
            {post.imageUrl.split(",").map((url: string, idx: number) => (
              <img
                key={idx}
                src={url.trim()}
                alt="Post media"
                className="rounded-xl object-cover max-h-80 w-1/4 border border-[#e3e8f0] dark:border-[#2a2d34] shadow-sm"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        )}
      </div>
      {/* Like/comment count and actions row */}
      <div className="flex flex-col border-b border-[#e3e8f0] dark:border-[#2a2d34] bg-white dark:bg-[#232946]">
        <div className="p-2 flex items-center justify-between w-full text-xs text-[#65676B] dark:text-[#B0B3B8]">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="text-[#1877F2]"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{post.commentsCount} comments</span>
          </div>
        </div>

        <div className="border-t border-[#e3e8f0] dark:border-[#2a2d34] w-full" />

        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            className="flex-1 flex flex-col items-center py-2 text-[#65676B] text-sm dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]"
          >
            Like
          </Button>
          <Button
            variant="ghost"
            className="flex-1 flex flex-col items-center py-2 text-[#65676B] text-sm dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946] border-l border-r border-[#e3e8f0] dark:border-[#2a2d34]"
          >
            Comment
          </Button>
          <Button
            variant="ghost"
            className="flex-1 flex flex-col items-center py-2 text-[#65676B] text-sm dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]"
          >
            Share
          </Button>
        </div>
      </div>
      {/* Comments list and input */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-4 flex-1 min-h-0 overflow-y-auto border-b border-[#e3e8f0] dark:border-[#2a2d34]">
          <CommentList
            comments={commentsData || []}
            loading={commentsLoading}
          />
        </div>
        <div className="p-4">
          {currentUser && (
            <CommentInput
              value={commentText}
              onChange={onCommentTextChange}
              onSubmit={onAddComment}
              loading={addCommentLoading}
              error={addCommentError}
              avatarUrl={currentUser.avatarUrl || placeholderUserAvatar}
              username={currentUser.username}
              placeholder={`Comment as ${currentUser.username}`}
            />
          )}
        </div>
      </div>
    </Modal>
  );
} 