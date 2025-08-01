import { useState } from "react";
import { Comment } from "./Comment";
import { useLikeMutations } from "../../hooks/mutations/useLikeMutations";
import { useCommentMutations } from "../../hooks/mutations/useCommentMutations";
import { ConfirmModal } from "../modals/ConfirmModal";
import { useAuthStore } from "@/store/auth";
import type { CommentResponseDto } from "@/types/api";
import type { CreateNestedCommentDto } from "@/types/comment";

interface CommentListProps {
  comments: CommentResponseDto[];
  loading: boolean;
  postId: string;
}

export function CommentList({ comments, loading, postId }: CommentListProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { likeCommentMutation } = useLikeMutations();
  const { deleteCommentMutation, createCommentMutation } = useCommentMutations();
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteCommentMutation.mutate({ postId, commentId: commentToDelete });
      setCommentToDelete(null);
    }
  };

  const handleReplyComment = (parentCommentId: string, content: string) => {
    const data: CreateNestedCommentDto = {
      content,
      parentCommentId
    };
    createCommentMutation.mutate({
      postId,
      data
    });
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
    <>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onLike={handleLikeComment}
            isLiking={likeCommentMutation.isPending}
            onDelete={handleDeleteComment}
            isDeleting={deleteCommentMutation.isPending}
            currentUser={currentUser}
            onReply={handleReplyComment}
            isReplying={createCommentMutation.isPending}
            postId={postId}
            isLeaf={comment.replyCount === 0}
          />
        ))}
      </ul>

      <ConfirmModal
        open={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
} 