import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import type { UserResponseDto } from "@/types/api";
import placeholderUserAvatar from "@/assets/images/placeholder_user_avatar.png";

interface CommentReplyInputProps {
  currentUser: UserResponseDto;
  onSubmit: (content: string) => void;
  onCancel: () => void;
  loading?: boolean;
  replyingTo?: string;
}

export function CommentReplyInput({ 
  currentUser, 
  onSubmit, 
  onCancel, 
  loading,
  replyingTo 
}: CommentReplyInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <Avatar
        src={currentUser.avatarUrl || placeholderUserAvatar}
        alt={currentUser.username || "User"}
        size={32}
        className="mt-1"
      />
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyingTo ? `Reply to ${replyingTo}...` : "Write a reply..."}
          className="min-h-[40px] resize-none bg-[#F0F2F5] dark:bg-[#3A3B3C] border-none focus:ring-0"
          required
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading || !content.trim()}
            className="text-sm"
          >
            {loading ? "Replying..." : "Reply"}
          </Button>
        </div>
      </div>
    </form>
  );
} 