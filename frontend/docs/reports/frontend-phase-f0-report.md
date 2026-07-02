# Frontend Phase F0: Master Executive Report

## 1. Executive Summary
The Spark React application is poised for a significant architectural overhaul. This Phase F0 audit assesses the current state of the frontend and outlines a strategic roadmap (F1-F12) to elevate the platform. The objective is to establish a world-class, highly performant web application while simultaneously laying the groundwork for a cross-platform React Native (Expo) mobile app via shared core logic.

## 2. Architecture
- **Current State:** A monolithic Vite React application with tightly coupled UI and business logic.
- **Future State:** A **TurboRepo Monorepo** separating concerns into `@spark/core` (logic), `@spark/web` (React DOM), and `@spark/mobile` (React Native). This ensures a single source of truth for APIs, State, and Models.

## 3. UI/UX & Design
- **Current State:** Ad-hoc custom CSS with inconsistent styling and scattered Framer Motion animations.
- **Future State:** A comprehensive **Tailwind CSS** design token system. Colors, typography, and spacing will be centralized into CSS variables, supporting seamless theming. Framer Motion springs and variants will be abstracted into reusable configuration files for consistent, fluid micro-interactions.

## 4. Components
- **Current State:** Bespoke components lacking a standardized API.
- **Future State:** Integration of **shadcn/ui** to provide highly accessible, customizable, and rigorously tested UI primitives (buttons, dialogs, forms) that natively consume our Tailwind design tokens.

## 5. API & Data Layer
- **Current State:** API calls made directly within UI components, tied to React lifecycle.
- **Future State:** Complete abstraction using **React Query** for caching and server state, combined with **Zustand** for client state. All logic will be encapsulated in custom hooks, completely abstracted away from the DOM.

## 6. Security
- Token management will be abstracted behind interface adapters, allowing secure storage (HttpOnly cookies for web, SecureStore for mobile).
- Strict Content Security Policies (CSP) and sanitization will be enforced in the core layer to prevent XSS.

## 7. Performance
- Core logic extraction will enable more aggressive code splitting.
- Heavy reliance on React Query will drastically reduce unnecessary re-renders.
- Asset optimization and lazy loading of heavy UI elements (like Lottie/Framer Motion complex SVGs) will improve Core Web Vitals.

## 8. React Native Readiness
By executing the planned F2 phase (State/API Abstraction), the Spark web app will become entirely "headless" in its business logic. Because stores and API services will no longer reference `window`, `document`, or `localStorage`, they can be dropped directly into an Expo environment, achieving up to 80% logic reuse.

## 9. F1-F12 Roadmap Summary
The migration is divided into 12 distinct phases to mitigate risk:
- **F1-F4 (Foundation):** Design System (Tailwind/shadcn), Core Logic Abstraction (React Query/Zustand), Monorepo Setup, Routing.
- **F5-F9 (Refactoring):** Migrating Core Components, Auth Flows, Discovery UI, and Real-time Chat to the new architecture.
- **F10-F12 (Launch):** Performance Tuning, React Native Mobile MVP Integration, and Production CI/CD rollout.

*Detailed breakdowns are available in `migration-roadmap.md` and `implementation-priority.md`.*
