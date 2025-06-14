import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi, commentsApi } from '../../lib/api';
import { useAuthStore } from '../../store/auth';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { UserMeta } from '../ui/UserMeta';
import { CommentInput } from '../comment/CommentInput';
import { CommentList } from '../comment/CommentList';
import type { PostResponseDto } from '../../types/api';

export interface PostProps {
  post: PostResponseDto;
  onEdit?: () => void;
}

export function Post({ post, onEdit }: PostProps) {
  const currentUser = useAuthStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();
  const isOwner = currentUser?.id === post.userId;

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.delete(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsDeleting(false);
    },
    onError: () => setIsDeleting(false),
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      deleteMutation.mutate();
    }
  };

  // Fetch comments when showComments is true
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => commentsApi.getByPost(post.id).then(res => res.data.data),
    enabled: showComments,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => commentsApi.create(post.id, { content }),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // update comment count
    },
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText.trim());
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6 border-none bg-gradient-to-br from-[#f0f4ff] via-[#f8fbff] to-[#eaf0fa] dark:from-[#232946] dark:via-[#232946] dark:to-[#181823] rounded-2xl shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-6 pb-2 border-b border-[#e3e8f0] dark:border-[#2a2d34]">
        <Avatar src={post.userAvatarUrl} alt={post.username || 'User'} size={48} />
        <UserMeta username={post.username} createdAt={post.createdAt} />
        {isOwner && (
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="icon" onClick={onEdit} title="Edit" className="text-[#1877F2] border-[#1877F2] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]">
              <span className="sr-only">Edit</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5l12.232-12.268Z"/></svg>
            </Button>
            <Button variant="danger" size="icon" onClick={handleDelete} disabled={isDeleting} title="Delete">
              <span className="sr-only">Delete</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 7h12M9 7V5a3 3 0 0 1 6 0v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12Z"/></svg>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-2 pt-4">
        {post.content && (
          <div className="mb-4 text-lg text-[#232946] dark:text-[#E4E6EB] whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        )}
        {/* Images grid */}
        {post.imageUrl && (
          <div className="flex gap-3 mb-2">
            {post.imageUrl.split(',').map((url, idx) => (
              <img
                key={idx}
                src={url.trim()}
                alt="Post media"
                className="rounded-xl object-cover max-h-80 w-1/4 border border-[#e3e8f0] dark:border-[#2a2d34] shadow-sm"
                style={{ aspectRatio: '3/4' }}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col px-6 pt-2 pb-4">
        <div className="flex items-center justify-between text-xs text-[#65676B] dark:text-[#B0B3B8] mb-2">
          <div className="flex items-center gap-2">
            {/* Like/heart icons can go here */}
          </div>
          <div>
            <button
              className="underline hover:text-[#1877F2] font-semibold cursor-pointer"
              onClick={() => setShowComments((v) => !v)}
              type="button"
            >
              {post.commentsCount} comments
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#e3e8f0] dark:border-[#2a2d34] pt-3 mt-2 gap-2">
          <Button variant="secondary" className="flex-1 text-[#1877F2] dark:text-[#A3BCF9] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline mr-1"><path stroke="currentColor" strokeWidth="2" d="M7 12l5 5L22 7"/></svg>
            Like
          </Button>
          <Button variant="secondary" className="flex-1 text-[#232946] dark:text-[#E4E6EB] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline mr-1"><path stroke="currentColor" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10Z"/></svg>
            Comment
          </Button>
        </div>
        {showComments && (
          <div className="mt-5 bg-[#f8fbff] dark:bg-[#232946] rounded-xl p-4 border border-[#e3e8f0] dark:border-[#2a2d34]">
            <CommentList comments={commentsData || []} loading={commentsLoading} />
            {currentUser && (
              <CommentInput
                value={commentText}
                onChange={setCommentText}
                onSubmit={handleAddComment}
                loading={addCommentMutation.isPending}
                error={(() => {
                  const err = addCommentMutation.error as any;
                  return err?.response?.data?.message || err?.message || '';
                })()}
                avatarUrl={currentUser.avatarUrl}
                username={currentUser.username}
              />
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 