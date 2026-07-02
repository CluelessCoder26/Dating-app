# Frontend Testing Strategy & Report

## 1. Testing Pyramid

### 1.1 Unit Testing (Vitest + React Testing Library)
- **Scope**: Hooks (`useAuth`, `useSwipe`), utilities (date formatters, socket event parsers), and pure components.
- **Goal**: 80%+ line coverage for all files in `src/hooks/` and `src/utils/`.

### 1.2 Component Testing (Storybook)
- **Scope**: All UI primitives in `src/shared/components` (Buttons, Dialogs, Cards).
- **Goal**: Every component must have a `.stories.tsx` file documenting its variants, states (loading, error, empty), and accessibility compliance via Storybook A11y addon.

### 1.3 End-to-End Testing (Playwright)
- **Scope**: Critical user journeys.
  1. Registration -> Profile Creation -> Photo Upload.
  2. Discovery -> Swipe Right -> Match Animation -> Open Chat.
  3. Settings -> Update Preferences -> Save.
- **Goal**: Ensure the primary monetization and engagement loops never regress.

### 1.4 Visual Regression (Chromatic)
- **Scope**: Automated UI snapshots taken on every Pull Request to detect unintended CSS/Tailwind changes.

## 2. Current Status
Testing infrastructure is being instantiated as part of the React 19 modernization. Playwright config will be placed in `tests/e2e/`, and Vitest config in `vite.config.js`.
