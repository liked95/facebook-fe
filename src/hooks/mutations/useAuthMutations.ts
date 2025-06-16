import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export function useAuthMutations() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.data.success && response.data.data.token) {
        setAuth(response.data.data.user, response.data.data.token);
        navigate("/");
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
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