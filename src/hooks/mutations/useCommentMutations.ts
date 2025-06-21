import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../../lib/api";
import type { CreateCommentDto, UpdateCommentDto } from "../../types/api";

export function useCommentMutations() {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateCommentDto }) =>
      commentsApi.create(postId, data),
    onSuccess: (_, { postId, data }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      
      // If this is a reply, invalidate the replies for the parent comment
      if (data.parentCommentId) {
        queryClient.invalidateQueries({ 
          queryKey: ["replies", postId, data.parentCommentId] 
        });
      }
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
      
      // Invalidate all replies queries for this post
      queryClient.invalidateQueries({ 
        queryKey: ["replies", postId] 
      });
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
      
      // Invalidate all replies queries for this post
      queryClient.invalidateQueries({ 
        queryKey: ["replies", postId] 
      });
    },
  });

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation
  };
} 