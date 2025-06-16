import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import type { LoginDto, RegisterDto } from '../../types/api';

export function useAuthMutations() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      if (response.data.success && response.data.data.token) {
        setAuth(response.data.data.user, response.data.data.token);
        navigate("/");
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (response) => {
      if (response.data.success && response.data.data.token) {
        setAuth(response.data.data.user, response.data.data.token);
        navigate("/");
      }
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
} 