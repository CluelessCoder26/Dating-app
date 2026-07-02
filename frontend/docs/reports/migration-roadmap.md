# Migration Roadmap: F1 to F12

This roadmap outlines the systematic migration and feature deployment for the Spark React architecture, ensuring a safe transition from the current state to a robust, scalable, and cross-platform ready production state.

## Phase 1: Foundation & Architecture (F1 - F4)

### F1: Design System & Tokens Extraction
- Audit and extract Colors, Typography, and Spacing.
- Setup Tailwind CSS and CSS variable tokens.
- Introduce `shadcn/ui` base primitives.
- Standardize Framer Motion animations.

### F2: State & API Abstraction
- Decouple API calls from components using React Query.
- Implement global state management (Zustand).
- Standardize storage adapters for cross-platform compatibility.

### F3: Monorepo Transition
- Convert the workspace to a TurboRepo monorepo.
- Create `@spark/core` for shared logic.
- Move web assets into `@spark/web`.

### F4: Routing & Navigation Revamp
- Upgrade to modern declarative routing (React Router v6+).
- Implement layout routes, nested routing, and proper auth guards.

## Phase 2: Core Features & Refactoring (F5 - F9)

### F5: Core Components Migration
- Refactor Forms, Buttons, and Cards using the new design system.
- Implement React Hook Form + Zod for validation.

### F6: Authentication & Onboarding
- Refactor Login/Register flows.
- Implement seamless JWT handling and refresh token logic in shared core.

### F7: Discovery & Matchmaking Interface
- Refactor the swipe/discovery UI.
- Apply centralized Framer Motion springs for fluid swipe gestures.

### F8: Real-time Chat & Notifications
- Decouple WebSockets from UI components.
- Implement robust reconnect logic and background sync in the core layer.

### F9: Profile & Settings Management
- Refactor media uploads, profile editing, and preference settings.

## Phase 3: Platform Expansion & Launch (F10 - F12)

### F10: Performance Optimization & Testing
- Audit Web Vitals, implement Code Splitting and Lazy Loading.
- Setup E2E testing (Cypress/Playwright) and Unit Testing (Jest).

### F11: React Native / Expo MVP
- Initialize `@spark/mobile` Expo app.
- Consume `@spark/core` logic.
- Build Mobile UI utilizing React Native equivalents (e.g., Nativewind).

### F12: Production Readiness & CI/CD
- Finalize CI/CD pipelines (GitHub Actions).
- Staging environment rollout and QA.
- Production Launch.
