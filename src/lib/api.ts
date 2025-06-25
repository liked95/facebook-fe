import axios from 'axios';
import type {
  ApiResponse,
  AuthResponseDto,
  CommentResponseDto,
  CreateCommentDto,
  LoginDto,
  PostResponseDto,
  RegisterDto,
  UpdateCommentDto,
  UserResponseDto,
  LikeActionResult,
  PostLikeDto,
  CommentLikeDto,
} from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      
      // Clear auth store state
      const { useAuthStore } = await import('../store/auth');
      useAuthStore.getState().clearAuth();
      
      // Only redirect if we're not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: RegisterDto) =>
    api.post<ApiResponse<AuthResponseDto>>('/Api/Auth/Register', data),
  
  login: (data: LoginDto) =>
    api.post<ApiResponse<AuthResponseDto>>('/Api/Auth/Login', data),
  
  me: () =>
    api.get<ApiResponse<UserResponseDto>>('/Api/Auth/Me'),
};

// Posts API
export const postsApi = {
  create: (data: FormData) =>
    api.post<ApiResponse<PostResponseDto>>('/Api/Posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  update: (postId: string, data: FormData) =>
    api.put<ApiResponse<PostResponseDto>>(`/Api/Posts/${postId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  delete: (postId: string) =>
    api.delete(`/Api/Posts/${postId}`),
};

// Comments API
export const commentsApi = {
  getByPost: (postId: string, pageNumber = 1, pageSize = 25) =>
    api.get<ApiResponse<CommentResponseDto[]>>(`/Api/Posts/${postId}/comments`, {
      params: { pageNumber, pageSize },
    }),
  
  getReplies: (postId: string, commentId: string, pageNumber = 1, pageSize = 25) =>
    api.get<ApiResponse<CommentResponseDto[]>>(`/Api/Posts/${postId}/comments/${commentId}/replies`, {
      params: { pageNumber, pageSize },
    }),
  
  create: (postId: string, data: CreateCommentDto) =>
    api.post<ApiResponse<CommentResponseDto>>(`/Api/Posts/${postId}/comments`, data),
  
  update: (postId: string, commentId: string, data: UpdateCommentDto) =>
    api.put<ApiResponse<CommentResponseDto>>(`/Api/Posts/${postId}/comments/${commentId}`, data),
  
  delete: (postId: string, commentId: string) =>
    api.delete(`/Api/Posts/${postId}/comments/${commentId}`),
};

// Users API
export const usersApi = {
  getById: (id: string) =>
    api.get<ApiResponse<UserResponseDto>>(`/Api/Users/${id}`),
  
  getPosts: (userId: string, pageNumber = 1, pageSize = 25) =>
    api.get<ApiResponse<PostResponseDto[]>>(`/Api/Users/${userId}/Posts`, {
      params: { pageNumber, pageSize },
    }),
};

// Feed API
export const feedApi = {
  getFeed: (pageNumber = 1, pageSize = 25) =>
    api.get<ApiResponse<PostResponseDto[]>>(`/Api/Feed`, {
      params: { pageNumber, pageSize },
    }),
};

// Likes API
export const likesApi = {
  likePost: (postId: string) =>
    api.post<LikeActionResult>(`/api/Likes/posts/${postId}`),
  
  getPostLikes: (postId: string, pageNumber = 1, pageSize = 25) =>
    api.get<PostLikeDto[]>(`/api/Likes/posts/${postId}`, {
      params: { pageNumber, pageSize },
    }),
  
  likeComment: (commentId: string) =>
    api.post<LikeActionResult>(`/api/Likes/comments/${commentId}`),
  
  getCommentLikes: (commentId: string, pageNumber = 1, pageSize = 25) =>
    api.get<CommentLikeDto[]>(`/api/Likes/comments/${commentId}`, {
      params: { pageNumber, pageSize },
    }),
};

export default api; 