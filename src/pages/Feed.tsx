import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedApi, commentsApi } from "../lib/api";
import { useAuthStore } from "../store/auth";
import { Post } from "../components/post/Post";
import { useState } from "react";
import { Avatar } from "../components/ui/Avatar";
import { CreateEditPostModal } from "../components/modals/CreateEditPostModal";
import { PostDetailModal } from "../components/modals/CommentModal";
import type { PostResponseDto } from "../types/api";

export function Feed() {
  const currentUser = useAuthStore((state) => state.user);
  const [commentModalPost, setCommentModalPost] =
    useState<PostResponseDto | null>(null);
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const [showPostModal, setShowPostModal] = useState(false);
  const [editPost, setEditPost] = useState<PostResponseDto | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed", currentUser?.id],
    queryFn: () => feedApi.getFeed(),
    enabled: !!currentUser,
  });

  // Modal comment logic
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", commentModalPost?.id],
    queryFn: () =>
      commentModalPost
        ? commentsApi
            .getByPost(commentModalPost.id)
            .then((res) => res.data.data)
        : [],
    enabled: !!commentModalPost,
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
      commentModalPost
        ? commentsApi.create(commentModalPost.id, { content })
        : Promise.resolve(),
    onSuccess: () => {
      setCommentText("");
      if (commentModalPost) {
        queryClient.invalidateQueries({
          queryKey: ["comments", commentModalPost.id],
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentModalPost) return;
    addCommentMutation.mutate(commentText.trim());
  };

  const handleAddCommentError = (err: unknown) => {
    if (err && typeof err === "object" && err !== null && "response" in err) {
      return (err as any).response?.data?.message || "";
    }
    if (err instanceof Error) return err.message;
    return "";
  };

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
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-[#eaf0fa] via-[#f8fbff] to-[#f0f4ff] dark:from-[#181823] dark:via-[#232946] dark:to-[#232946] py-10 px-2">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Fake input to open create post modal */}
        <div className="mb-6">
          <div
            className="flex items-center gap-3 bg-white dark:bg-[#232946] rounded-xl shadow px-4 py-3 cursor-pointer border border-[#e3e8f0] dark:border-[#2a2d34]"
            onClick={() => {
              setEditPost(null);
              setShowPostModal(true);
            }}
          >
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.username || "User"}
              size={40}
            />
            <div className="flex-1">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-[#65676B] dark:text-[#B0B3B8] placeholder-[#65676B] dark:placeholder-[#B0B3B8] cursor-pointer"
                placeholder={`What's on your mind, ${currentUser.username}?`}
                readOnly
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts?.data.data.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          posts?.data.data.map((post) => (
            <Post
              key={post.id}
              post={post}
              onOpenCommentModal={() => setCommentModalPost(post)}
              onEdit={() => {
                setEditPost(post);
                setShowPostModal(true);
              }}
            />
          ))
        )}
      </div>

      <CreateEditPostModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        post={editPost}
        currentUser={currentUser}
      />

      <PostDetailModal
        post={commentModalPost}
        onClose={() => setCommentModalPost(null)}
        currentUser={currentUser}
        commentsData={commentsData || []}
        commentsLoading={commentsLoading}
        commentText={commentText}
        onCommentTextChange={setCommentText}
        onAddComment={handleAddComment}
        addCommentLoading={addCommentMutation.isPending}
        addCommentError={handleAddCommentError(addCommentMutation.error)}
      />
    </div>
  );
}
