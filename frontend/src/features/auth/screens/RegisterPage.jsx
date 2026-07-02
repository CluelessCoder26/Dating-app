import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering with:", { name, email, password });
  };

  return (
    <>
      <div className="auth-screen-header">
        <h2 className="auth-screen-title">Create Account</h2>
        <p className="auth-screen-subtitle">
          Join us and start your journey today.
        </p>
      </div>

      <div className="auth-form-wrapper">
        <form onSubmit={handleRegister}>
          <div className="auth-input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="auth-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            style={{ marginTop: "2rem" }}
          >
            Create Account
          </button>
        </form>
      </div>

      <div className="auth-link-text">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Sign In
        </Link>
      </div>
    </>
  );
};
