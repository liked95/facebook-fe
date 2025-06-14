import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/theme';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/Button';

export function Layout() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">SocialApp</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => navigate('/')}>
                    Home
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/profile')}>
                    Profile
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={toggleTheme}>
                {theme === 'dark' ? '🌞' : '🌙'}
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
} 