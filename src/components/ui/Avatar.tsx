import React from 'react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  return (
    <img
      src={src || '/avatar.png'}
      alt={alt || 'User'}
      width={size}
      height={size}
      className={`rounded-full border border-[#DADDE1] dark:border-[#3A3B3C] object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
} 