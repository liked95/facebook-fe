import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "../../store/auth";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { PostActions } from "./PostActions";
import { PostImages } from "./PostImages";
import { PostPrivacy } from "./PostPrivacy";
import type { PostResponseDto } from "../../types/api";
import { usePostMutations } from "../../hooks/mutations/usePostMutations";
import { useLikeMutations } from "../../hooks/mutations/useLikeMutations";

interface PostProps {
  post: PostResponseDto;
  onOpenCommentModal: () => void;
  onEdit: () => void;
}

export function Post({ post, onOpenCommentModal, onEdit }: PostProps) {
  const currentUser = useAuthStore((state) => state.user);
  const [showActions, setShowActions] = useState(false);
  const { deletePostMutation } = usePostMutations();
  const { likePostMutation } = useLikeMutations();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(post.id);
    }
  };

  const handleLike = () => {
    likePostMutation.mutate(post.id);
  };

  return (
    <div className="bg-white dark:bg-[#232946] rounded-xl shadow-sm border border-[#e3e8f0] dark:border-[#2a2d34] overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`}>
              <Avatar
                src={post.userAvatarUrl}
                alt={post.username || "User"}
                size={40}
              />
            </Link>
            <div>
              <Link
                to={`/profile/${post.userId}`}
                className="font-semibold hover:underline"
              >
                {post.username}
              </Link>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <span>•</span>
                <PostPrivacy privacy={post.privacy} />
              </div>
            </div>
          </div>
          {currentUser?.id === post.userId && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActions(!showActions)}
              >
                <Icon name="more" className="h-5 w-5" />
              </Button>
              {showActions && (
                <PostActions
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onClose={() => setShowActions(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Images */}
      {post.imageUrl && (
        <PostImages images={post.imageUrl.split(",")} />
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-[#e3e8f0] dark:border-[#2a2d34]">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="heart" className="h-4 w-4 text-red-500" />
            <span>{post.likesCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="message-circle" className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-[#e3e8f0] dark:border-[#2a2d34]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={handleLike}
            disabled={likePostMutation.isPending}
          >
            <Icon
              name={post.isLikedByCurrentUser ? "heart" : "heart-outline"}
              className={`h-5 w-5 ${
                post.isLikedByCurrentUser ? "text-red-500" : ""
              }`}
            />
            <span>Like</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onOpenCommentModal}
          >
            <Icon name="message-circle" className="h-5 w-5" />
            <span>Comment</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
