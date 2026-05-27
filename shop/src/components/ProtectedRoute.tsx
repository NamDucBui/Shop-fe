// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  const token = localStorage.getItem("token")
  if(!user || !token) return <Navigate to="/login" replace />;

  // Nếu đã đăng nhập, cho phép truy cập trang con
  return children;
};