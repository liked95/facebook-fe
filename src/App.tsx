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

function AppRoutes() {
  useAuthCheck();

  return (
    <Routes>
      {/* Protected Routes - Require authentication */}
      <Route element={<Layout />}>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } 
        />
        {/* Add more protected routes here:
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        /> */}
      </Route>
      
      {/* Public Routes - Redirect authenticated users away */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      {/* Add more public routes here:
      <Route 
        path="/about" 
        element={
          <PublicRoute>
            <About />
          </PublicRoute>
        } 
      /> */}
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
