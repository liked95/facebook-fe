import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedApi, commentsApi } from "../lib/api";
import { useAuthStore } from "../store/auth";
import { Post } from "../components/post/Post";
import { useState } from "react";
import { Modal } from "../components/ui/Modal";
import { CommentInput } from "../components/comment/CommentInput";
import { CommentList } from "../components/comment/CommentList";
import placeholderUserAvatar from "../assets/images/placeholder_user_avatar.png";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { UserMeta } from "../components/ui/UserMeta";
import { CreateEditPostModal } from '../components/post/CreateEditPostModal';

export function Feed() {
  const currentUser = useAuthStore((state) => state.user);
  const [commentModalPost, setCommentModalPost] = useState<any | null>(null); // selected post for modal
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const [showPostModal, setShowPostModal] = useState(false);
  const [editPost, setEditPost] = useState(null);

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
            .then((res: any) => res.data.data)
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
          <div className="flex items-center gap-3 bg-white dark:bg-[#232946] rounded-xl shadow px-4 py-3 cursor-pointer border border-[#e3e8f0] dark:border-[#2a2d34]" onClick={() => { setEditPost(null); setShowPostModal(true); }}>
            <Avatar src={currentUser.avatarUrl} alt={currentUser.username || 'User'} size={40} />
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
          posts?.data.data.map((post) => <Post key={post.id} post={post} onOpenCommentModal={() => setCommentModalPost(post)} onEdit={() => { setEditPost(post); setShowPostModal(true); }} />)
        )}
      </div>
      {/* Global create/edit post modal */}
      <CreateEditPostModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        post={editPost}
        currentUser={currentUser}
      />
      {/* Global comment modal */}
      <Modal
        open={!!commentModalPost}
        onClose={() => setCommentModalPost(null)}
        widthClassName="max-w-2xl"
      >
        {commentModalPost && (
          <>
            {/* Post content (no footer) */}
            <div className="p-4 border-b border-[#e3e8f0] dark:border-[#2a2d34]">
              <div className="flex flex-row items-center gap-4 mb-2">
                <Avatar
                  src={commentModalPost.userAvatarUrl}
                  alt={commentModalPost.username || "User"}
                  size={48}
                />
                <UserMeta
                  username={commentModalPost.username}
                  createdAt={commentModalPost.createdAt}
                />
              </div>
              {commentModalPost.content && (
                <div className="mb-4 text-lg text-[#232946] dark:text-[#E4E6EB] whitespace-pre-line leading-relaxed">
                  {commentModalPost.content}
                </div>
              )}
              {commentModalPost.imageUrl && (
                <div className="flex gap-3 mb-2">
                  {commentModalPost.imageUrl.split(",").map((url, idx) => (
                    <img
                      key={idx}
                      src={url.trim()}
                      alt="Post media"
                      className="rounded-xl object-cover max-h-80 w-1/4 border border-[#e3e8f0] dark:border-[#2a2d34] shadow-sm"
                      style={{ aspectRatio: "3/4" }}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Like/comment count and actions row (just like feed) */}
            <div className="flex flex-col border-b border-[#e3e8f0] dark:border-[#2a2d34] bg-white dark:bg-[#232946]">
              <div className="p-2 flex items-center justify-between w-full text-xs text-[#65676B] dark:text-[#B0B3B8]">
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-[#1877F2]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    0
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{commentModalPost.commentsCount} comments</span>
                </div>
              </div>

              <div className="border-t border-[#e3e8f0] dark:border-[#2a2d34] w-full" />

              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  className="flex-1 flex flex-col items-center py-2 text-[#65676B] text-sm dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]"
                >
                  Like
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 flex flex-col items-center py-2 text-[#65676B] text-sm dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946] border-l border-r border-[#e3e8f0] dark:border-[#2a2d34]"
                >
                  Comment
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 flex flex-col items-center py-2 text-[#65676B] text-sm dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]"
                >
                  Share
                </Button>
              </div>
            </div>
            {/* Comments list and input, flex column, input always at bottom */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="p-4 flex-1 min-h-0 overflow-y-auto border-b border-[#e3e8f0] dark:border-[#2a2d34]">
                <CommentList
                  comments={commentsData || []}
                  loading={commentsLoading}
                />
              </div>
              <div className="p-4">
                {currentUser && (
                  <CommentInput
                    value={commentText}
                    onChange={setCommentText}
                    onSubmit={handleAddComment}
                    loading={addCommentMutation.isPending}
                    error={(() => {
                      const err = addCommentMutation.error as unknown;
                      if (
                        err &&
                        typeof err === "object" &&
                        err !== null &&
                        "response" in err
                      ) {
                        // @ts-expect-error: error object may have response property from Axios or similar libraries
                        return err.response?.data?.message || "";
                      }
                      if (err instanceof Error) return err.message;
                      return "";
                    })()}
                    avatarUrl={currentUser.avatarUrl || placeholderUserAvatar}
                    username={currentUser.username}
                    placeholder={`Comment as ${currentUser.username}`}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
