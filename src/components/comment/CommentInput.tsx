import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

export interface CommentInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string;
  avatarUrl?: string | null;
  username?: string | null;
  placeholder?: string;
}

export function CommentInput({ value, onChange, onSubmit, loading, error, avatarUrl, username, placeholder }: CommentInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex items-start gap-2">
      <img
        src={avatarUrl || '/avatar.png'}
        alt={username || 'User'}
        className="w-8 h-8 rounded-full border border-[#DADDE1] dark:border-[#3A3B3C] object-cover mt-1"
      />
      <div className="flex-1">
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Write a comment...'}
          className="min-h-[40px] resize-none"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !value.trim()}
        className="h-10"
      >
        {loading ? 'Posting...' : 'Post'}
      </Button>
      {error && (
        <div className="text-sm text-red-500 mt-2">{error}</div>
      )}
    </form>
  );
} 