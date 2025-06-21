export interface CreateNestedCommentDto {
  content: string;
  parentCommentId?: string;
}

export interface RepliesQueryParams {
  pageNumber?: number;
  pageSize?: number;
} 