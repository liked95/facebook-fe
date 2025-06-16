import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Avatar } from '../ui/Avatar';
import { usePostMutations } from '../../hooks/mutations/usePostMutations';
import type { PostResponseDto, PrivacyType, UserResponseDto } from '../../types/api';

export interface CreatePostProps {
  post: PostResponseDto | null;
  onClose: () => void;
  currentUser: UserResponseDto;
}

export function CreatePost({ post, onClose, currentUser }: CreatePostProps) {
  const isEdit = !!post;
  const [content, setContent] = useState(post?.content || '');
  const [privacy, setPrivacy] = useState<PrivacyType>(post?.privacy ?? 0);
  const { createPostMutation, updatePostMutation } = usePostMutations();

  useEffect(() => {
    if (isEdit) {
      setContent(post?.content || '');
      setPrivacy(post?.privacy ?? 0);
    } else {
      setContent('');
      setPrivacy(0);
    }
  }, [isEdit, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const data = { content: content.trim(), privacy };
    if (isEdit && post) {
      updatePostMutation.mutate({ postId: post.id, data });
    } else {
      createPostMutation.mutate(data);
    }
    
    setContent('');
    setPrivacy(0);
    onClose();
  };

  const isPending = createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-center gap-3 p-6 pb-2 border-b border-[#e3e8f0] dark:border-[#2a2d34]">
        <Avatar src={currentUser.avatarUrl} alt={currentUser.username || 'User'} size={40} />
        <div className="flex flex-col">
          <span className="font-bold text-base text-[#232946] dark:text-[#E4E6EB]">{currentUser.username}</span>
          <select
            value={privacy}
            onChange={e => setPrivacy(Number(e.target.value) as PrivacyType)}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs mt-1"
          >
            <option value={0}>Public</option>
            <option value={1}>Friends</option>
            <option value={2}>Private</option>
          </select>
        </div>
      </div>
      <div className="p-6 pt-4 flex-1">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="min-h-[120px] resize-none text-lg"
          required
        />
      </div>
      <div className="flex justify-end gap-2 px-6 pb-6">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? (isEdit ? 'Saving...' : 'Posting...') : isEdit ? 'Save' : 'Post'}
        </Button>
      </div>
    </form>
  );
} 