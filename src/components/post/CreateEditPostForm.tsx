import { useEffect, useState, useRef, useMemo } from 'react';
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

type MediaListItem = MediaFileDto | File;

function isFile(item: MediaListItem): item is File {
  return (item as File).type !== undefined;
}

export function CreateEditPostForm({ post, onClose, currentUser }: CreatePostProps) {
  const isEdit = !!post;
  const [content, setContent] = useState(post?.content || '');
  const [privacy, setPrivacy] = useState<PrivacyType>(post?.privacy ?? 0);
  const { createPostMutation, updatePostMutation } = usePostMutations();
  const [mediaList, setMediaList] = useState<MediaListItem[]>(post?.mediaFiles ? [...post.mediaFiles] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && post) {
      setContent(post?.content || '');
      setPrivacy(post?.privacy ?? 0);
      setMediaList(post?.mediaFiles ? [...post.mediaFiles] : []);
    } else {
      setContent('');
      setPrivacy(0);
      setMediaList([]);
    }
  }, [isEdit, post]);

  // Generate preview URLs for new files and clean up on unmount or change
  const filePreviews = useMemo(() => {
    const urls = mediaList.map(item => isFile(item) ? URL.createObjectURL(item) : undefined);
    return urls;
  }, [mediaList]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [filePreviews]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setMediaList(prev => [...prev, ...files]);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('privacy', privacy.toString());

    // Collect ordered existing media IDs and append new files
    const existingMediaIds: string[] = [];
    mediaList.forEach((item) => {
      if (isFile(item)) {
        formData.append('mediaFiles', item);
      } else {
        existingMediaIds.push(item.id);
      }
    });

    if (isEdit) {
      // Append each existing media ID individually with the same key name
      existingMediaIds.forEach(id => {
        formData.append('existingMediaIds', id);
      });
    }

    const resetForm = () => {
      setContent('');
      setPrivacy(0);
      setMediaList([]);
    };

    if (isEdit && post) {
      updatePostMutation.mutate(
        { postId: post.id, data: formData },
        {
          onSuccess: () => {
            resetForm();
            onClose();
            updatePostMutation.reset();
          },
        }
      );
    } else {
      createPostMutation.mutate(formData, {
        onSuccess: () => {
          resetForm();
          onClose();
          createPostMutation.reset();
        },
      });
    }
  };

  const isPending = createPostMutation.isPending || updatePostMutation.isPending;

  // Prepare preview data for MediaPreviewGrid
  const previewProps = mediaList.reduce<{
    existingMedia: MediaFileDto[];
    mediaPreviews: string[];
    mediaFiles: File[];
  }>(
    (acc, item, idx) => {
      if (isFile(item)) {
        acc.mediaFiles.push(item);
        acc.mediaPreviews.push(filePreviews[idx] || '');
      } else {
        acc.existingMedia.push(item);
      }
      return acc;
    },
    { existingMedia: [], mediaPreviews: [], mediaFiles: [] }
  );

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
            {mediaList.length > 0 && (
              <MediaPreviewGrid
                existingMedia={previewProps.existingMedia}
                mediaPreviews={previewProps.mediaPreviews}
                mediaFiles={previewProps.mediaFiles}
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
        <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="loader size-4 border-2 border-t-transparent rounded-full animate-spin"></span>
              {isEdit ? 'Saving...' : 'Posting...'}
            </span>
          ) : isEdit ? 'Save' : 'Post'}
        </Button>
      </div>
    </form>
  );
} 