import { Avatar } from "../ui/Avatar";
import { UserMeta } from "../ui/UserMeta";
import { Button } from "../ui/Button";
import { useLikeMutations } from "../../hooks/mutations/useLikeMutations";
import type { CommentResponseDto } from "../../types/api";

interface CommentListProps {
  comments: CommentResponseDto[];
  loading: boolean;
}

export function CommentList({ comments, loading }: CommentListProps) {
  const { likeCommentMutation } = useLikeMutations();

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-muted-foreground">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar
            src={comment.userAvatarUrl}
            alt={comment.username || "User"}
            size={32}
          />
          <div className="flex-1">
            <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-2xl px-3 py-2">
              <UserMeta
                username={comment.username}
                createdAt={comment.createdAt}
                className="text-xs"
              />
              <p className="text-[#232946] dark:text-[#E4E6EB] mt-1">
                {comment.content}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-1 px-2">
              <Button
                variant="ghost"
                className={`text-xs text-[#65676B] dark:text-[#B0B3B8] hover:bg-transparent hover:text-[#1877F2] dark:hover:text-[#1877F2] ${comment.isLikedByCurrentUser ? 'text-[#1877F2]' : ''}`}
                onClick={() => handleLikeComment(comment.id)}
                disabled={likeCommentMutation.isPending}
              >
                Like
              </Button>
              <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                {comment.likesCount} likes
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 