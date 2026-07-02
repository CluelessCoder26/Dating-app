import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for 3 seconds then redirect to welcome
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page-container">
      <div className="splash-logo-wrapper">
        <svg
          width="100"
          height="100"
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
      <div className="splash-loading-bar">
        <div className="splash-loading-progress"></div>
      </div>
    </div>
  );
};
