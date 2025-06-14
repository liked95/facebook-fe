import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/theme";
import { useAuthStore } from "../../store/auth";
import { Button } from "../ui/Button";

export function Layout() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen font-facebook font-sans bg-[#F0F2F5] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB]">
      <header className="fixed top-0 w-full z-50 border-b border-[#DADDE1] dark:border-[#3E4042] bg-white dark:bg-[#242526] shadow-sm">
        <div className="max-w-full flex h-14 items-center px-5">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" onClick={() => navigate("/")} href="#">
              <span className="font-bold text-xl">FuckBook</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
                  <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
                  <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
                  <Button variant="ghost" onClick={() => navigate("/register")}>Register</Button>
                </>
              )}
              <Button variant="ghost" onClick={toggleTheme}>
                {theme === "dark" ? "🌞" : "🌙"}
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container max-w-full pt-20 pb-6">
        <Outlet />
      </main>
    </div>
  );
}
