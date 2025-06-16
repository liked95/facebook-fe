import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "../../store/auth";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

import { PostActions } from "./PostActions";
import { PostImages } from "./PostImages";
import { PostPrivacy } from "./PostPrivacy";
import { ConfirmModal } from "../modals/ConfirmModal";
import type { PostResponseDto } from "../../types/api";
import { usePostMutations } from "../../hooks/mutations/usePostMutations";
import { useLikeMutations } from "../../hooks/mutations/useLikeMutations";

import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";

interface PostProps {
  post: PostResponseDto;
  onOpenCommentModal: () => void;
  onEdit: () => void;
}

export function Post({ post, onOpenCommentModal, onEdit }: PostProps) {
  const currentUser = useAuthStore((state) => state.user);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePostMutation } = usePostMutations();
  const { likePostMutation } = useLikeMutations();

  const handleTriggerDeleteConfirmationModal = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deletePostMutation.mutate(post.id);
  };

  const handleLike = () => {
    likePostMutation.mutate(post.id);
  };

  return (
    <>
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
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2d34]"
                >
                  <EllipsisHorizontalIcon className="size-5" />
                </Button>
                {showActions && (
                  <PostActions
                    onEdit={onEdit}
                    onDelete={handleTriggerDeleteConfirmationModal}
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
        {post.imageUrl && <PostImages images={post.imageUrl.split(",")} />}

        {/* Post Stats */}
        <div className="px-4 py-2 border-t border-[#e3e8f0] dark:border-[#2a2d34]">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <HandThumbUpIcon className="size-5" />
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleOvalLeftIcon className="size-5" />
              <span>{post.commentsCount}</span>
            </div>
          </div>
        </div>

        {/* Post Actions */}
        <div className="px-2 py-2 border-t border-[#e3e8f0] dark:border-[#2a2d34]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className={`flex-1 flex justify-center text-sm items-center gap-2 ${
                post.isLikedByCurrentUser ? "text-[#1877F2]" : ""
              }`}
              onClick={handleLike}
              disabled={likePostMutation.isPending}
            >
              {post.isLikedByCurrentUser ? (
                <div className="text-[#1877F2]">
                  <HandThumbUpIcon className="size-5" />
                </div>
              ) : (
                <HandThumbUpIcon className="size-5" />
              )}
              <span>Like</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 flex justify-center text-sm items-center gap-2"
              onClick={onOpenCommentModal}
            >
              <ChatBubbleOvalLeftIcon className="size-5" />

              <span>Comment</span>
            </Button>

            <Button variant="ghost" className="flex-1 flex justify-center text-sm items-center gap-2">
              <ArrowPathIcon className="size-5" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
