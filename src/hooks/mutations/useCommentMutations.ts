import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../../lib/api";
import type { CreateCommentDto, UpdateCommentDto } from "../../types/api";
import { likesApi } from '../../lib/api';

export function useCommentMutations() {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateCommentDto }) =>
      commentsApi.create(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      data,
    }: {
      postId: string;
      commentId: string;
      data: UpdateCommentDto;
    }) => commentsApi.update(postId, commentId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => commentsApi.delete(postId, commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) => likesApi.likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    likeCommentMutation,
  };
} 