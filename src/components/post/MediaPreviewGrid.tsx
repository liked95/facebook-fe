import React from 'react';
import type { MediaFileDto } from '../../types/api';

interface MediaPreviewGridProps {
  mediaPreviews?: string[];
  mediaFiles?: File[];
  existingMedia?: MediaFileDto[];
  handleRemoveMedia: (index: number, isExisting: boolean) => void;
  inline?: boolean;
}

export const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  mediaPreviews = [],
  mediaFiles = [],
  existingMedia = [],
  handleRemoveMedia,
  inline,
}) => (
  <div className={inline ? "mt-2 grid grid-cols-5 gap-2" : "absolute left-0 right-0 bottom-0 px-2 pb-2"}>
    {/* Existing media (from server) */}
    {existingMedia.map((media, idx) => {
      const isImage = media.mediaType === 'image';
      const isVideo = media.mediaType === 'video';
      return (
        <div
          key={media.id}
          className="relative w-20 h-20 border rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          {isImage && <img src={media.blobUrl} alt={media.originalFileName} className="object-cover w-full h-full" />}
          {isVideo && (
            <video src={media.blobUrl} controls className="object-cover w-full h-full" />
          )}
          <button
            type="button"
            onClick={() => handleRemoveMedia(idx, true)}
            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            aria-label="Remove media"
          >
            ×
          </button>
        </div>
      );
    })}
    {/* New uploads (local) */}
    {mediaPreviews.map((url, idx) => {
      const file = mediaFiles[idx];
      const isImage = file?.type.startsWith('image/');
      const isVideo = file?.type.startsWith('video/');
      return (
        <div
          key={url}
          className="relative w-20 h-20 border rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          {isImage && <img src={url} alt="preview" className="object-cover w-full h-full" />}
          {isVideo && (
            <video src={url} controls className="object-cover w-full h-full" />
          )}
          <button
            type="button"
            onClick={() => handleRemoveMedia(idx, false)}
            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            aria-label="Remove media"
          >
            ×
          </button>
        </div>
      );
    })}
  </div>
); 