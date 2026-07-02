import React from "react";
import { Outlet } from "react-router-dom";
import "../features/auth/screens/Auth.css";

export const AuthLayout = () => {
  return (
    <div className="auth-layout-container">
      {/* Left side: Animated Brand / Hero */}
      <div className="auth-hero-section">
        <div className="hero-content">
          <div className="logo-placeholder">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h1 className="hero-title">Spark</h1>
          <p className="hero-subtitle">Ignite meaningful connections.</p>
        </div>
        {/* Animated background shapes */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Right side: Auth Form / Screen Content */}
      <div className="auth-content-section">
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
