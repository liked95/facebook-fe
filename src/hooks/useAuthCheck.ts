import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { authApi } from '../lib/api';

export const useAuthCheck = () => {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token && isAuthenticated) {
        try {
          // Validate token by calling the me endpoint
          await authApi.me();
        } catch {
          // If token is invalid, clear auth and redirect to login
          clearAuth();
          navigate('/login', { replace: true });
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, clearAuth, navigate]);
}; 