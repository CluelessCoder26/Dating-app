# Zustand Platform Architecture

## Overview
**Zustand** is our designated solution for **Client State Management**. It is used for global state that does not belong to the server (e.g., UI toggles, multi-step form progress, local user preferences).

## Store Guidelines
- **Multiple Stores**: Avoid creating one massive monolithic store. Create separate stores for distinct domains (e.g., `useUIStore`, `useFilterStore`, `useSwipeStore`).
- **Slices Pattern**: If a store grows too large, utilize the slices pattern to compose smaller store fragments together.
- **Actions alongside State**: Keep state updating actions within the store itself.

## Example
```typescript
import { create } from 'zustand';

interface SwipeState {
  currentProfileIndex: number;
  nextProfile: () => void;
  reset: () => void;
}

export const useSwipeStore = create<SwipeState>((set) => ({
  currentProfileIndex: 0,
  nextProfile: () => set((state) => ({ currentProfileIndex: state.currentProfileIndex + 1 })),
  reset: () => set({ currentProfileIndex: 0 }),
}));
```

## Selectors
Always use selectors when consuming state in components to prevent unnecessary re-renders.
