import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "../../lib/api";

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