import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../lib/api';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import type { PrivacyType } from '../../types/api';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<PrivacyType>(0);
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPostMutation.mutate({
      content: content.trim(),
      privacy,
    });
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
            <div className="flex items-center space-x-4">
              <select
                value={privacy}
                onChange={(e) => setPrivacy(Number(e.target.value) as PrivacyType)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={0}>Public</option>
                <option value={1}>Friends</option>
                <option value={2}>Private</option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={createPostMutation.isPending || !content.trim()}
          >
            {createPostMutation.isPending ? 'Posting...' : 'Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 