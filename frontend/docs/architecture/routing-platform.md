# Routing Platform Architecture

## Overview
The routing layer is responsible for mapping URLs to specific React components and managing navigation state. We use **React Router DOM v6**.

## Strategy
We utilize the Data Router approach (`createBrowserRouter`) provided by React Router v6 to enable advanced data fetching and error handling patterns.

### Route Definitions
Routes are defined centrally in `src/routes/index.tsx`.
- **Public Routes**: Accessible without authentication (e.g., Login, Signup, Landing).
- **Private Routes**: Require an active user session (e.g., Swipe Deck, Messages, Profile).

### Private Route Implementation
A `ProtectedRoute` wrapper is used to enforce authentication checks. If a user is unauthenticated, they are redirected to the Login page with a `state.from` payload to allow post-login redirection.

## Code Splitting & Lazy Loading
All top-level route components must be lazy-loaded to reduce the initial bundle size.

```tsx
import { lazy, Suspense } from 'react';

const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

// Usage in router
{
  path: 'profile',
  element: (
    <Suspense fallback={<PageLoader />}>
      <ProfilePage />
    </Suspense>
  )
}
```
