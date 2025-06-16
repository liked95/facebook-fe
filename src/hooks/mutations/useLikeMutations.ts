import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likesApi } from "../../lib/api";

export function useLikeMutations() {
  const queryClient = useQueryClient();

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => likesApi.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) => likesApi.likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return {
    likePostMutation,
    likeCommentMutation,
  };
} 