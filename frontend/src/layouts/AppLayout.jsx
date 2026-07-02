import React from "react";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div
      className="app-layout"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <header
        style={{
          padding: "1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Navigation / Header logic here */}
        <h1>Dating App</h1>
      </header>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        <Outlet />
      </main>
      <footer
        style={{
          padding: "1rem",
          textAlign: "center",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        &copy; {new Date().getFullYear()} Dating App
      </footer>
    </div>
  );
};
