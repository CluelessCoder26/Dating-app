# React Query Platform Architecture

## Overview
**TanStack Query** (React Query) is our designated solution for **Server State Management**. It handles data fetching, caching, synchronization, and background updates.

## Configuration
The global `QueryClient` is initialized in `src/lib/react-query.ts`.
- **Stale Time**: Defaulted to 5 minutes to prevent over-fetching.
- **Retry Policy**: Defaulted to 1 retry on failure for GET requests, 0 for mutations.
- **Refetch on Window Focus**: Disabled globally, enabled explicitly on specific dynamic queries (like messages).

## Query Keys
Query keys must be structured as arrays to allow for hierarchical cache invalidation. We use query key factories to maintain consistency.

```typescript
export const matchKeys = {
  all: ['matches'] as const,
  lists: () => [...matchKeys.all, 'list'] as const,
  list: (filters: string) => [...matchKeys.lists(), { filters }] as const,
  details: () => [...matchKeys.all, 'detail'] as const,
  detail: (id: string) => [...matchKeys.details(), id] as const,
};
```

## Custom Hooks
Always wrap `useQuery` and `useMutation` in custom React hooks to encapsulate the logic and keep components clean.
