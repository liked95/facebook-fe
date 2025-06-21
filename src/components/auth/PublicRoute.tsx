import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    // If user is authenticated and trying to access login/register,
    // redirect to the intended destination or home page
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}; 