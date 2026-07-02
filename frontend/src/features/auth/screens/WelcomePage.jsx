import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export const WelcomePage = () => {
  return (
    <div className="auth-card" style={{ animation: "slideUp 0.8s ease-out" }}>
      <div className="auth-screen-header">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
            color: "#FF416C",
          }}
        >
          <svg
            width="48"
            height="48"
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
        <h2 className="auth-screen-title">Spark Identity Journey</h2>
        <p className="auth-screen-subtitle">
          Your journey to meaningful connections starts here.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "2.5rem",
        }}
      >
        <Link to="/register" style={{ textDecoration: "none" }}>
          <button className="auth-button">
            Create an Account
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button className="auth-button secondary">
            I already have an account
          </button>
        </Link>
      </div>
    </div>
  );
};
