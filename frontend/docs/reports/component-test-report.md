# Phase F2: Component Testing Strategy Report

## Overview
This document details the testing strategy for the new component library, leveraging Vitest as the test runner and React Testing Library (RTL) for rendering and interacting with React components. The goal is to ensure high reliability, accessibility, and correct behavior of all UI elements.

## Testing Stack
- **Test Runner**: Vitest (fast, native ESM support, compatible with Vite).
- **Testing Utility**: React Testing Library (focuses on testing components from the user's perspective).
- **DOM Matchers**: `@testing-library/jest-dom` for expressive assertions (e.g., `toBeInTheDocument()`, `toHaveStyle()`).
- **User Interactions**: `@testing-library/user-event` for simulating realistic user interactions (clicks, typing, focus).

## Testing Strategy

### 1. Rendering and Snapshot Testing
- **Basic Rendering**: Verify that components render without crashing using default props.
- **Prop Variations**: Test rendering with various combinations of props to ensure correct output variations (e.g., different sizes, variants).
- **Snapshots**: Utilize snapshot testing sparingly, primarily for complex UI structures where unintended changes need to be caught quickly.

### 2. Interaction and Behavior Testing
- **Event Simulation**: Use `user-event` to simulate user actions like clicking buttons, typing in input fields, and opening dialogs.
- **State Changes**: Assert that the component's UI updates correctly in response to interactions (e.g., a modal becomes visible, a button shows a loading state).
- **Callback Invocations**: Verify that event handler props (e.g., `onClick`, `onChange`) are called with the correct arguments.

### 3. Accessibility Testing in RTL
- **Semantic Queries**: Prioritize queries like `getByRole`, `getByLabelText`, and `getByText` over `getByTestId` to enforce accessible markup.
- **Axe Integration**: Integrate `jest-axe` within Vitest to run programmatic accessibility audits on rendered components, complementing the Storybook addon.

### 4. Integration Testing
- While individual components are tested in isolation, complex composite components (e.g., complex forms, interactive tables) are tested to ensure their child components interact seamlessly.

## Best Practices
- Tests should reside adjacent to the component they test (e.g., `Button.test.tsx` next to `Button.tsx`).
- Aim for high test coverage on core interactive logic, rather than focusing solely on styling details.
- Avoid testing implementation details; focus on inputs (props, user actions) and outputs (rendered DOM, callbacks).
