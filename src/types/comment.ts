import type { CommentResponseDto } from "./api";

export interface NestedCommentResponseDto extends CommentResponseDto {
  replies?: NestedCommentResponseDto[];
  parentId?: string;
}

export interface CreateNestedCommentDto {
  content: string;
  parentId?: string;
} 