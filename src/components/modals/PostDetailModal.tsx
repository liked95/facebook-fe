import { Modal } from "./Modal";
import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { CommentList } from "../comment/CommentList";
import { CommentInput } from "../comment/CommentInput";
import placeholderUserAvatar from "../../assets/images/placeholder_user_avatar.png";
import type { PostResponseDto, UserResponseDto, CommentResponseDto, MediaFileDto } from "../../types/api";
import { PostImages } from "../post/PostImages";

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
            meta={
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>•</span>
                <span>{post.privacy === 0 ? "Public" : post.privacy === 1 ? "Friends" : "Private"}</span>
              </div>
            }
          />
        </div>

        {/* Post Content */}
        <div className="flex-1 overflow-y-auto p-4 ">
          <div className="mb-4 pb-4 border-b border-[#e3e8f0] dark:border-[#2a2d34]">
            <p className="text-lg whitespace-pre-wrap">{post.content}</p>
            {(post.mediaFiles && post.mediaFiles.length > 0) && (
              <div className="mt-2">
                <PostImages images={post.mediaFiles.filter((f: MediaFileDto) => f.mediaType === 'image').map((f: MediaFileDto) => f.blobUrl)} />
              </div>
            )}
            {(post.mediaFiles && post.mediaFiles.some((f: MediaFileDto) => f.mediaType === 'video')) && (
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-2">
                  {post.mediaFiles.filter((f: MediaFileDto) => f.mediaType === 'video').map((f: MediaFileDto, idx: number) => (
                    <video key={idx} src={f.blobUrl} controls className="w-full rounded-lg object-cover max-h-96" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <CommentList
            comments={commentsData}
            loading={commentsLoading}
            postId={post.id}
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