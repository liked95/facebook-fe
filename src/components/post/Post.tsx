import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../lib/api';
import { useAuthStore } from '../../store/auth';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { UserMeta } from '../ui/UserMeta';
import type { PostResponseDto } from '../../types/api';
import { Divider } from '../ui/Divider';

export interface PostProps {
  post: PostResponseDto;
  onEdit?: () => void;
  onOpenCommentModal?: () => void;
}

export function Post({ post, onEdit, onOpenCommentModal }: PostProps) {
  const currentUser = useAuthStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);
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
      <CardContent className="px-6 py-4">
        {post.content && (
          <div className="text-lg text-[#232946] dark:text-[#E4E6EB] whitespace-pre-line leading-relaxed">
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

      <Divider />

      <CardFooter className="flex flex-col px-6 pt-2 pb-4">
        <div className="flex items-center justify-between w-full text-xs text-[#65676B] dark:text-[#B0B3B8] mb-1">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" fill="currentColor" className="text-[#1877F2]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{post.commentsCount} comments</span>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mx-auto mb-1"><path stroke="currentColor" strokeWidth="2" d="M7 12l5 5L22 7"/></svg>
            <span className="text-xs font-semibold">Like</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946] border-l border-r border-[#e3e8f0] dark:border-[#2a2d34]" onClick={onOpenCommentModal}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mx-auto mb-1"><path stroke="currentColor" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10Z"/></svg>
            <span className="text-xs font-semibold">Comment</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#eaf0fa] dark:hover:bg-[#232946]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mx-auto mb-1"><path stroke="currentColor" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            <span className="text-xs font-semibold">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 