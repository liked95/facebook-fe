import { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Avatar } from '../ui/Avatar';
import { usePostMutations } from '../../hooks/mutations/usePostMutations';
import type { PostResponseDto, PrivacyType, UserResponseDto, MediaFileDto } from '../../types/api';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { MediaPreviewGrid } from './MediaPreviewGrid';

export interface CreatePostProps {
  post: PostResponseDto | null;
  onClose: () => void;
  currentUser: UserResponseDto;
}

export function CreateEditPostForm({ post, onClose, currentUser }: CreatePostProps) {
  const isEdit = !!post;
  const [content, setContent] = useState(post?.content || '');
  const [privacy, setPrivacy] = useState<PrivacyType>(post?.privacy ?? 0);
  const { createPostMutation, updatePostMutation } = usePostMutations();
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaFileDto[]>(post?.mediaFiles || []);
  const [removedExistingMedia, setRemovedExistingMedia] = useState<MediaFileDto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEdit && post) {
      setContent(post?.content || '');
      setPrivacy(post?.privacy ?? 0);
      setMediaFiles([]);
      setMediaPreviews([]);
      setExistingMedia(post?.mediaFiles || []);
      setRemovedExistingMedia([]);
    } else {
      setContent('');
      setPrivacy(0);
      setMediaFiles([]);
      setMediaPreviews([]);
      setExistingMedia([]);
      setRemovedExistingMedia([]);
    }
  }, [isEdit, post]);
  
  console.log("Go here: ", isEdit);
  console.log("🚀 ~ CreateEditPostForm ~ mediaPreviews:", mediaPreviews)
  console.log("🚀 ~ CreateEditPostForm ~ mediaFiles:", mediaFiles)
  
  // Generate previews when mediaFiles changes
  useEffect(() => {
    const urls = mediaFiles.map(file => URL.createObjectURL(file));
    setMediaPreviews(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaFiles]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleRemoveMedia = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setRemovedExistingMedia(prev => [...prev, existingMedia[index]]);
      setExistingMedia(prev => prev.filter((_, i) => i !== index));
    } else {
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
      setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('privacy', privacy.toString());
    mediaFiles.forEach(file => {
      formData.append('mediaFiles', file);
    });
    if (isEdit && removedExistingMedia.length > 0) {
      formData.append('removedMediaIds', JSON.stringify(removedExistingMedia.map(m => m.id)));
    }

    if (isEdit && post) {
      updatePostMutation.mutate({ postId: post.id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }

    setContent('');
    setPrivacy(0);
    setMediaFiles([]);
    setMediaPreviews([]);
    setExistingMedia([]);
    setRemovedExistingMedia([]);
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
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[120px] resize-none text-lg"
              required
            />
            {(existingMedia.length > 0 || mediaPreviews.length > 0) && (
              <MediaPreviewGrid
                existingMedia={existingMedia}
                mediaPreviews={mediaPreviews}
                mediaFiles={mediaFiles}
                handleRemoveMedia={handleRemoveMedia}
                inline
              />
            )}
          </div>
          {/* Upload Button */}
          <div className="mt-4">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleMediaChange}
            />
            <button
              type="button"
              aria-label="Add Photo/Video"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <PhotoIcon className="w-7 h-7 text-blue-500" />
            </button>
          </div>
        </div>
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