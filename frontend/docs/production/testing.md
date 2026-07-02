# Testing Strategy

## Layers of Testing
1. **Unit Testing (Jest/Vitest)**
   - Focus: Utility functions, custom hooks, reducers.
   - Coverage Target: 80%

2. **Component Testing (React Testing Library)**
   - Focus: User interactions, rendering states, accessibility.
   - Key components (buttons, forms, modals) must be fully tested.

3. **Integration Testing**
   - Focus: Multi-component flows, API mocking (via MSW).
   - Validates that components communicate correctly with the data layer.

4. **End-to-End Testing (Cypress/Playwright)**
   - Focus: Critical user journeys (Signup, Login, Swipe, Match, Message).
   - Runs against the Staging environment prior to production releases.

## Quality Gates
- No PR can be merged without passing all Unit and Component tests.
- E2E tests must pass on Staging before triggering a production deployment.
