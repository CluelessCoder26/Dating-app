import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <>
      <div className="auth-screen-header">
        <h2 className="auth-screen-title">Welcome Back</h2>
        <p className="auth-screen-subtitle">
          Sign in to continue finding your spark.
        </p>
      </div>

      <div className="auth-form-wrapper">
        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1.5rem",
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                color: "#94a3b8",
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
      </div>

      <div className="auth-link-text">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Create one
        </Link>
      </div>
    </>
  );
};
