# React Native Readiness Report

## Executive Summary
This report evaluates the current React web codebase for its readiness to support a React Native (Expo) mobile application. By decoupling business logic, state management, and API services from the DOM, we can achieve maximum code reuse between the web and mobile platforms.

## Current State Analysis
Currently, the Spark React application tightly couples UI rendering with business logic. Components often directly manage API calls, and web-specific APIs (like `window`, `document`, and `localStorage`) are sprinkled throughout the codebase.

## Abstracting Services & Store from the DOM

### 1. State Management Abstraction
To share logic with Expo, state management must be entirely platform-agnostic.
- **Action Plan**: Migrate local component state and context providers to a robust state management solution like **Zustand** or **Redux Toolkit**. 
- **Benefit**: Stores will reside in shared modules. Both React DOM (web) and React Native (Expo) can subscribe to the exact same stores without needing to understand the underlying platform.

### 2. API & Data Fetching Layer
Data fetching should not rely on component lifecycle methods bound to the DOM.
- **Action Plan**: Utilize **React Query** (or SWR) alongside a centralized API client (`api.js`). 
- **Benefit**: Query definitions, caching, and background fetching logic can be shared across web and mobile. 

### 3. Storage Adapters
Web uses `localStorage`/`sessionStorage`, while React Native uses `AsyncStorage` or `SecureStore`.
- **Action Plan**: Create a generic `StorageService` interface. Dependency injection or environment-based resolution will provide the correct implementation for each platform.
- **Benefit**: Authentication flows (JWT handling) can be shared 100% across platforms.

### 4. Custom Hooks as the Integration Layer
- **Action Plan**: All complex logic should be encapsulated in custom hooks (e.g., `useMatchmaking()`, `useChat()`). These hooks will internally use the shared state and API layers.
- **Benefit**: The UI components in React web and React Native simply call `const { matches, swipeRight } = useMatchmaking()`. The UI only handles presentation.

## Path to Shared Logic (Monorepo)
To facilitate this, we recommend migrating to a **TurboRepo** monorepo structure:
- `@spark/core`: Contains all API clients, Zustand stores, React Query hooks, and utilities. (Platform agnostic, no DOM or React Native imports).
- `@spark/web`: The current Vite/React web app, consuming `@spark/core`.
- `@spark/mobile`: The new Expo React Native app, also consuming `@spark/core`.

## Conclusion
By abstracting services and the store away from the DOM, Spark can achieve up to 70-80% code reuse for logic, ensuring feature parity between Web and Mobile with minimal duplicate effort.
