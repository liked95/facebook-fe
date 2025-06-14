import axios from 'axios';
import type {
  ApiResponse,
  AuthResponseDto,
  CommentResponseDto,
  CreateCommentDto,
  CreatePostDto,
  LoginDto,
  PostResponseDto,
  RegisterDto,
  UpdateCommentDto,
  UpdatePostDto,
  UserResponseDto,
} from '../types/api';

const API_URL = 'https://localhost:7066';

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
  create: (data: CreatePostDto) =>
    api.post<ApiResponse<PostResponseDto>>('/Api/Posts', data),
  
  update: (postId: string, data: UpdatePostDto) =>
    api.put<ApiResponse<PostResponseDto>>(`/Api/Posts/${postId}`, data),
  
  delete: (postId: string) =>
    api.delete(`/Api/Posts/${postId}`),
};

// Comments API
export const commentsApi = {
  getByPost: (postId: string, pageNumber = 1, pageSize = 25) =>
    api.get<ApiResponse<CommentResponseDto[]>>(`/Api/Posts/${postId}/comments`, {
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

export default api; 