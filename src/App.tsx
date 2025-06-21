// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { useAuthCheck } from "./hooks/useAuthCheck";
import { Feed } from "./pages/Feed";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

const queryClient = new QueryClient();

// Define protected routes array
const protectedRoutes = [
  {
    path: "/",
    element: <Feed />,
  }
];

// Define public routes array
const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }
];

function AppRoutes() {
  useAuthCheck();

  return (
    <Routes>
      {/* Protected Routes - Require authentication */}
      <Route element={<Layout />}>
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}
      </Route>
      
      {/* Public Routes - Redirect authenticated users away */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
        />
      ))}
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
