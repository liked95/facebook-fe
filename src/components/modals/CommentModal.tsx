import { Modal } from "./Modal";
import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
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
      <div className="flex flex-col h-[80vh]">
        {/* Post Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e3e8f0] dark:border-[#2a2d34]">
          <Avatar
            src={post.userAvatarUrl || placeholderUserAvatar}
            alt={post.username || "User"}
            size={40}
          />
          <UserMeta
            username={post.username}
            createdAt={post.createdAt}
            meta={
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>•</span>
                <span>{post.privacy === 0 ? "Public" : post.privacy === 1 ? "Friends" : "Private"}</span>
              </div>
            }
          />
        </div>

        {/* Post Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <p className="text-lg whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <div className="mt-4">
                <img
                  src={post.imageUrl}
                  alt="Post media"
                  className="max-h-96 rounded-lg object-contain"
                />
              </div>
            )}
          </div>

          {/* Comments */}
          <CommentList
            comments={commentsData}
            loading={commentsLoading}
          />
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-[#e3e8f0] dark:border-[#2a2d34]">
          <CommentInput
            value={commentText}
            onChange={onCommentTextChange}
            onSubmit={onAddComment}
            loading={addCommentLoading}
            error={addCommentError}
            avatarUrl={currentUser.avatarUrl}
            username={currentUser.username}
            placeholder={`Comment as ${currentUser.username}`}
          />
        </div>
      </div>
    </Modal>
  );
} 