import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../../lib/api";
import type { CreateCommentDto, UpdateCommentDto } from "../../types/api";

export function useCommentMutations() {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateCommentDto }) =>
      commentsApi.create(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
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
      queryClient.invalidateQueries({ queryKey: ["feed"] });

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
      queryClient.invalidateQueries({ queryKey: ["feed"] });

    },
  });

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation
  };
} 