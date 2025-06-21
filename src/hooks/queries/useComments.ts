import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "../../lib/api";
import type { RepliesQueryParams } from "../../types/comment";

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      postId
        ? commentsApi.getByPost(postId).then((res) => res.data.data)
        : [],
    enabled: !!postId,
  });
}

export function useReplies(
  postId: string | undefined,
  commentId: string | undefined,
  params: RepliesQueryParams = {}
) {
  return useQuery({
    queryKey: ["replies", postId, commentId, params],
    queryFn: () =>
      postId && commentId
        ? commentsApi.getReplies(postId, commentId, params.pageNumber || 1, params.pageSize || 25)
            .then((res) => res.data.data)
        : [],
    enabled: !!(postId && commentId),
  });
} 