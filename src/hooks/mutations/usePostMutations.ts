import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../../lib/api";
import type { CreatePostDto, UpdatePostDto } from "../../types/api";

export function usePostMutations() {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostDto) => postsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: UpdatePostDto }) =>
      postsApi.update(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

    },
  });

  return {
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
  };
} 