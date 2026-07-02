import React from "react";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div
      className="public-layout"
      style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-primary)" }}
    >
      <main>
        <Outlet />
      </main>
    </div>
  );
};
