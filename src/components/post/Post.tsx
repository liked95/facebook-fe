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
    <Card className="w-full max-w-2xl mx-auto mt-4 border border-[#DADDE1] dark:border-[#3E4042] bg-white dark:bg-[#242526] rounded-md shadow-sm">
      <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
        <Avatar src={post.userAvatarUrl} alt={post.username || 'User'} size={40} />
        <UserMeta username={post.username} createdAt={post.createdAt} />
        {isOwner && (
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="icon" onClick={onEdit} title="Edit" className="text-[#65676B] dark:text-[#B0B3B8]">
              <span className="sr-only">Edit</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5l12.232-12.268Z"/></svg>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} title="Delete" className="text-[#FA3E3E]">
              <span className="sr-only">Delete</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 7h12M9 7V5a3 3 0 0 1 6 0v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12Z"/></svg>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-2">
        {post.content && (
          <div className="mb-3 text-[#050505] dark:text-[#E4E6EB] whitespace-pre-line">
            {post.content}
          </div>
        )}
        {/* Images grid */}
        {post.imageUrl && (
          <div className="flex gap-2">
            {post.imageUrl.split(',').map((url, idx) => (
              <img
                key={idx}
                src={url.trim()}
                alt="Post media"
                className="rounded-md object-cover max-h-96 w-1/4"
                style={{ aspectRatio: '3/4' }}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col px-4 pt-2 pb-2">
        <div className="flex items-center justify-between text-xs text-[#65676B] dark:text-[#B0B3B8] mb-1">
          <div className="flex items-center gap-2">
            {/* Like/heart icons can go here */}
            {/* <span role="img" aria-label="like">👍</span>
            <span role="img" aria-label="love">❤️</span> */}
          </div>
          <div>
            <button
              className="underline hover:text-[#1877F2] cursor-pointer"
              onClick={() => setShowComments((v) => !v)}
              type="button"
            >
              {post.commentsCount} comments
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#DADDE1] dark:border-[#3E4042] pt-2 mt-1">
          <Button variant="ghost" className="flex-1 text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline mr-1"><path stroke="currentColor" strokeWidth="2" d="M7 12l5 5L22 7"/></svg>
            Like
          </Button>
          <Button variant="ghost" className="flex-1 text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline mr-1"><path stroke="currentColor" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10Z"/></svg>
            Comment
          </Button>
        </div>
        {showComments && (
          <div className="mt-3">
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