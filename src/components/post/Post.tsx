import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { postsApi } from '../../lib/api';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import type { PostResponseDto } from '../../types/api';

interface PostProps {
  post: PostResponseDto;
  onEdit?: () => void;
}

export function Post({ post, onEdit }: PostProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const isOwner = currentUser?.id === post.userId;

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.delete(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-4">
        <img
          src={post.userAvatarUrl || '/default-avatar.png'}
          alt={post.username || 'User'}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{post.username}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            {post.isEdited && ' (edited)'}
          </p>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              disabled={isDeleting}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post attachment"
            className="mt-4 max-h-96 w-full rounded-lg object-cover"
          />
        )}
        {post.videoUrl && (
          <video
            src={post.videoUrl}
            controls
            className="mt-4 max-h-96 w-full rounded-lg"
          />
        )}
        {post.fileUrl && (
          <a
            href={post.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-primary hover:underline"
          >
            📎 Download Attachment
          </a>
        )}
      </CardContent>
      <CardFooter className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>{post.commentsCount} comments</span>
      </CardFooter>
    </Card>
  );
} 