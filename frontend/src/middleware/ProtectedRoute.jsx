import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthStore } from '../store/authStore';

// Mock auth store hook for scaffold
const useAuthStore = () => {
  // Replace with actual Zustand implementation
  return { isAuthenticated: false, isLoading: false };
};

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper Loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
