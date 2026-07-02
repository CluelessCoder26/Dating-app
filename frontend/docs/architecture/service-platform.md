# Service Platform Architecture

## Overview
The Service Layer abstracts the API interactions and third-party integrations away from React components and hooks. This ensures separation of concerns and makes testing easier.

## Structure
Services are located in `src/services/` or inside feature modules (`src/features/*/services/`).

### REST Services
Each business entity has a dedicated service file, e.g., `UserService.ts`, `MatchService.ts`.

```typescript
import apiClient from '@/lib/apiClient';

export const MatchService = {
  getPotentialMatches: async (params: QueryParams) => {
    const response = await apiClient.get('/matches/potential', { params });
    return response.data;
  },
  
  likeUser: async (userId: string) => {
    const response = await apiClient.post(`/matches/like/${userId}`);
    return response.data;
  }
};
```

## Guidelines
- Components should **not** call services directly. They should use React Query hooks which in turn call the services.
- Services should only handle data fetching, transformation, and throwing typed errors.
- Services must remain stateless.
