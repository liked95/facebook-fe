import { useQuery } from "@tanstack/react-query";
import { feedApi } from "../lib/api";
import { useAuthStore } from "../store/auth";
import { CreatePost } from "../components/post/CreatePost";
import { Post } from "../components/post/Post";

export function Feed() {
  const currentUser = useAuthStore((state) => state.user);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed", currentUser?.id],
    queryFn: () => feedApi.getFeed(),
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Please log in to view your feed
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CreatePost />
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : posts?.data.data.length === 0 ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      ) : (
        posts?.data.data.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}
