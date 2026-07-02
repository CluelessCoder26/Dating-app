import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// Layouts
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { PublicLayout } from "../layouts/PublicLayout";

// Middleware
import { ProtectedRoute } from "../middleware/ProtectedRoute";
import { RoleGuard } from "../middleware/RoleGuard";

// Lazy-loaded feature routes
const Home = lazy(() =>
  import("../features/home/HomePage").catch(() => ({
    default: () => <div>Home Page Placeholder</div>,
  })),
);
const Login = lazy(() =>
  import("../features/auth/LoginPage").catch(() => ({
    default: () => <div>Login Page Placeholder</div>,
  })),
);
const Register = lazy(() =>
  import("../features/auth/RegisterPage").catch(() => ({
    default: () => <div>Register Page Placeholder</div>,
  })),
);
const Profile = lazy(() =>
  import("../features/profile/ProfilePage").catch(() => ({
    default: () => <div>Profile Page Placeholder</div>,
  })),
);
const Matches = lazy(() =>
  import("../features/matches/MatchesPage").catch(() => ({
    default: () => <div>Matches Page Placeholder</div>,
  })),
);
const AdminDashboard = lazy(() =>
  import("../features/admin/DashboardPage").catch(() => ({
    default: () => <div>Admin Dashboard Placeholder</div>,
  })),
);
const Unauthorized = lazy(() =>
  import("../features/error/UnauthorizedPage").catch(() => ({
    default: () => <div>Unauthorized Placeholder</div>,
  })),
);
const NotFound = lazy(() =>
  import("../features/error/NotFoundPage").catch(() => ({
    default: () => <div>404 Not Found Placeholder</div>,
  })),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "profile",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "matches",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Matches />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <RoleGuard allowedRoles={["admin"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
