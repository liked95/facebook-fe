export type PrivacyType = 0 | 1 | 2;

export interface UserResponseDto {
  id: string;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: string | null;
  createdAt: string;
}

export interface AuthResponseDto {
  token: string | null;
  expires: string;
  user: UserResponseDto;
}

export interface PostResponseDto {
  id: string;
  content: string | null;
  createdAt: string;
  userId: string;
  username: string | null;
  userAvatarUrl: string | null;
  privacy: PrivacyType;
  isEdited: boolean;
  imageUrl: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  commentsCount: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
}

export interface CommentResponseDto {
  id: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  userId: string;
  username: string | null;
  userAvatarUrl: string | null;
  postId: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
}

export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
  statusCode: number;
  meta?: PaginationMeta;
  errorCode: string | null;
}

// DTOs for requests
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreatePostDto {
  content: string;
  privacy?: PrivacyType;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
}

export interface UpdatePostDto {
  content?: string;
  privacy?: PrivacyType;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface LikeActionResult {
  isLiked: boolean;
  totalLikes: number;
  message: string | null;
}

export interface PostLikeDto {
  id: string;
  userId: string;
  username: string | null;
  userAvatarUrl: string | null;
  createdAt: string;
}

export interface CommentLikeDto {
  id: string;
  userId: string;
  username: string | null;
  userAvatarUrl: string | null;
  createdAt: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
} 