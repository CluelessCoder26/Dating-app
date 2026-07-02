# Frontend Platform Architecture Overview

## Introduction
This document outlines the core architectural decisions and standards for the frontend platform of the Dating App.

## Technology Stack
- **Framework**: React 18+ (with Vite for build tooling)
- **Language**: TypeScript for static type checking and improved developer experience
- **State Management**:
  - Server State: TanStack Query (React Query)
  - Client State: Zustand
- **Routing**: React Router DOM (v6+)
- **Styling**: Tailwind CSS with Radix UI / Shadcn for accessible components
- **Network**: Axios for REST, Socket.io-client for real-time communication

## Project Structure
The repository follows a feature-based architecture:
```
src/
├── app/          # App-wide configurations, providers, and global styles
├── assets/       # Static assets (images, fonts)
├── components/   # Shared UI components
├── config/       # Environment variables and global config
├── features/     # Feature-based modules (e.g., matching, chat, profile)
├── hooks/        # Shared custom React hooks
├── lib/          # Pre-configured 3rd party libraries (e.g., Axios, Socket.io)
├── routes/       # Application routing configuration
├── services/     # API service layer
├── store/        # Global Zustand stores
├── types/        # Shared TypeScript types
└── utils/        # Utility functions
```

## Guiding Principles
1. **Component Modularity**: Keep components small, focused, and reusable.
2. **Type Safety**: Avoid `any`. Use strict TypeScript types.
3. **Performance First**: Lazy load routes and heavy components. Use memoization judiciously.
4. **Testability**: Write unit tests for utilities/hooks and integration tests for critical user flows.
