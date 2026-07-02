import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export const SecurityAlert = ({ type, onAction }) => {
  const getAlertConfig = () => {
    switch (type) {
      case "locked":
        return {
          title: "Account Locked",
          message:
            "For your security, your account has been temporarily locked due to suspicious activity. Please reset your password or contact support to regain access.",
          icon: (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          ),
          iconClass: "error",
          actionText: "Reset Password",
          linkPath: "/reset-password",
        };
      case "too-many-attempts":
        return {
          title: "Too Many Attempts",
          message:
            "You have made too many unsuccessful login attempts. Please wait 15 minutes before trying again, or reset your password.",
          icon: (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          ),
          iconClass: "warning",
          actionText: "Back to Login",
          linkPath: "/login",
        };
      case "session-expired":
        return {
          title: "Session Expired",
          message:
            "Your session has expired due to inactivity. Please sign in again to continue finding your spark.",
          icon: (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          ),
          iconClass: "info",
          actionText: "Sign In",
          linkPath: "/login",
        };
      default:
        return {
          title: "Security Alert",
          message: "A security event has occurred.",
          icon: null,
          iconClass: "info",
          actionText: "Go Home",
          linkPath: "/",
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div className="security-alert-container">
      <div className={`security-alert-icon ${config.iconClass}`}>
        {config.icon}
      </div>
      <h2 className="security-alert-title">{config.title}</h2>
      <p className="security-alert-message">{config.message}</p>

      {onAction ? (
        <button onClick={onAction} className="auth-button">
          {config.actionText}
        </button>
      ) : (
        <Link
          to={config.linkPath}
          style={{ width: "100%", textDecoration: "none" }}
        >
          <button className="auth-button">{config.actionText}</button>
        </Link>
      )}
    </div>
  );
};
