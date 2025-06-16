import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { Post } from "../components/post/Post";
import { Avatar } from "../components/ui/Avatar";
import { CreateEditPostModal } from "../components/modals/CreateEditPostModal";
import { PostDetailModal } from "../components/modals/CommentModal";
import type { PostResponseDto } from "../types/api";
import { useFeed } from "../hooks/queries/useFeed";
import { useComments } from "../hooks/queries/useComments";
import { useCommentMutations } from "../hooks/mutations/useCommentMutations";

export function Feed() {
  const currentUser = useAuthStore((state) => state.user);
  const [commentModalPost, setCommentModalPost] =
    useState<PostResponseDto | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [editPost, setEditPost] = useState<PostResponseDto | null>(null);

  const { data: posts, isLoading } = useFeed(currentUser?.id);
  const { data: commentsData, isLoading: commentsLoading } = useComments(commentModalPost?.id);
  const { createCommentMutation } = useCommentMutations();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentModalPost) return;
    createCommentMutation.mutate({
      postId: commentModalPost.id,
      data: { content: commentText.trim() },
    });
    setCommentText("");
  };

  const handleAddCommentError = (err: unknown) => {
    if (err && typeof err === "object" && err !== null && "response" in err) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      return errorResponse.response?.data?.message || "";
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
        addCommentLoading={createCommentMutation.isPending}
        addCommentError={handleAddCommentError(createCommentMutation.error)}
      />
    </div>
  );
}
