import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuthStore } from '../store/authStore';

// Mock auth store hook for scaffold
const useAuthStore = () => {
  // Replace with actual Zustand implementation
  return { user: { role: "user" }, isAuthenticated: false };
};

export const RoleGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
