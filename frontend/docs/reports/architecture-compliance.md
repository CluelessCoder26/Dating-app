# Architecture Compliance Guidelines

## Overview
To maintain a high-quality codebase, all developers must adhere to these compliance guidelines during Phase F3 and beyond.

## 1. Type Strictness
- `strict: true` must remain enabled in `tsconfig.json`.
- The use of `any` is strictly prohibited. Use `unknown` if the type is truly dynamic, followed by type narrowing.
- API response types must be accurately defined and kept in sync with the backend contract.

## 2. State Management Rules
- Do NOT use Redux. Use Zustand for client state.
- Do NOT store server data in Zustand. Server data must only live in React Query's cache.
- Local component state (`useState`) should be preferred unless state needs to be shared across the component tree.

## 3. Styling Rules
- Use Tailwind CSS utility classes exclusively.
- Do not write custom CSS in `.css` files unless absolutely necessary for complex animations or third-party overrides.
- Use `clsx` and `tailwind-merge` (often combined as a `cn` utility) for conditional class names.

## 4. API & Data Fetching
- All API calls must go through Axios. Do not use raw `fetch`.
- All data fetching in components must be done via React Query hooks.
- Handle loading and error states gracefully in UI components.

## Compliance Metrics
- 0 TypeScript errors on build.
- 0 ESLint warnings on commit.
- 100% of routes lazy-loaded.
