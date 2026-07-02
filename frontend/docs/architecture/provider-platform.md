# Provider Platform Architecture

## Overview
React Context Providers are used to inject global configurations, themes, and specific un-changing or low-frequency-changing states into the component tree.

## Standard Providers
The application is wrapped in several standard providers located in `src/app/providers.tsx`.

1. **ThemeProvider**: Manages Light/Dark mode state and CSS variables.
2. **QueryClientProvider**: Provides the TanStack Query client for server state caching.
3. **AuthProvider**: Maintains the minimal authentication state (token existence, decoded JWT info).
4. **SocketProvider**: Maintains the WebSocket connection instance.
5. **ToastProvider**: Handles global application notifications and toasts.

## Provider Composition
To avoid "Provider Hell" (deeply nested providers in `App.tsx`), we compose them into a single `AppProvider` component.

```tsx
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            {children}
            <ToastContainer />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
```
