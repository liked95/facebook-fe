import { Comment } from './Comment';

export interface CommentListProps {
  comments: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export function CommentList({ comments, loading, emptyMessage = 'No comments yet.' }: CommentListProps) {
  if (loading) {
    return <div className="text-sm text-[#65676B] dark:text-[#B0B3B8]">Loading comments...</div>;
  }
  if (!comments || comments.length === 0) {
    return <div className="text-sm text-[#65676B] dark:text-[#B0B3B8]">{emptyMessage}</div>;
  }
  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </ul>
  );
} 