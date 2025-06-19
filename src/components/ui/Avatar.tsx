import placeholderUserAvatar from '../../assets/images/placeholder_user_avatar.png';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  return (
    <img
      src={src || placeholderUserAvatar}
      alt={alt || 'User'}
      width={size}
      height={size}
      className={`rounded-full border-2 border-[#1877F2] shadow-md object-cover bg-[#F0F2F5] dark:bg-[#3A3B3C] ${className}`}
      style={{ width: size, height: size }}
    />
  );
} 