# Spark UI Contract

This document outlines the fundamental rules and design principles for the Spark Design System. Every component and UI implementation must adhere to these rules.

## Design Principles
- **Clarity over Cleverness**: UI elements should be immediately understandable.
- **Consistent Constraints**: Use the defined design tokens for everything.
- **Accessibility by Default**: Ensure every component works for all users.
- **Dynamic and Alive**: Use micro-interactions to create a responsive feel.

## Component Rules
- **No Hardcoded Colors**: Never use hex codes, RGB, or HSL values directly in components. Always use semantic color tokens (e.g., `var(--color-primary)`).
- **Strict Token Usage**: Spacing, typography, and layout must rely strictly on the defined design tokens.
- **Prop Exclusivity**: Avoid passing arbitrary inline styles. Use predefined variants or utility classes.
- **State Management**: Clearly define and handle all visual states (hover, active, focus, disabled, loading).

## Accessibility Rules
- **WCAG AA**: All components must meet WCAG 2.1 AA standards at a minimum.
- **Keyboard Navigation**: Everything must be accessible via keyboard, with visible focus indicators.
- **Semantic HTML**: Use correct HTML elements (buttons for actions, links for navigation).
- **ARIA Attributes**: Apply ARIA attributes only when semantic HTML is insufficient.
