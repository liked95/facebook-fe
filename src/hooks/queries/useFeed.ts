import { useQuery } from "@tanstack/react-query";
import { feedApi } from "../../lib/api";

export function useFeed(userId: string | undefined) {
  return useQuery({
    queryKey: ["feed", userId],
    queryFn: () => feedApi.getFeed(),
    enabled: !!userId,
  });
} 