# Phase F2: Storybook Configuration Report

## Overview
Storybook is utilized as the primary workshop for building, documenting, and testing UI components in isolation. This report outlines how Storybook is configured to ensure robust testing for dark mode, responsiveness, and accessibility across the component library.

## Configuration Highlights

### 1. Dark Mode Testing
- **Addon Integration**: Storybook is configured with a theme-switching addon (e.g., `storybook-dark-mode` or custom background toggles).
- **Global Decorators**: A global decorator applies the appropriate CSS classes (e.g., `.dark` for Tailwind) to the Storybook preview iframe based on the selected theme.
- **Verification**: Developers can toggle between light and dark modes within the Storybook UI to instantly verify color contrasts and styling adjustments.

### 2. Responsiveness Testing
- **Viewport Addon**: The `@storybook/addon-viewport` is integrated and configured with a set of custom viewports matching our target devices (e.g., Mobile Small, Mobile Large, Tablet, Desktop).
- **Responsive Stories**: Components are expected to render correctly across all configured viewports. Developers can rapidly switch viewports in the toolbar to evaluate fluid typography, flexbox/grid adjustments, and media queries.

### 3. Accessibility (A11y) Testing
- **Addon-a11y**: The `@storybook/addon-a11y` is installed and configured.
- **Automated Checks**: This addon runs axe-core against every story, providing real-time feedback in the Storybook panel regarding contrast ratios, ARIA roles, label associations, and keyboard navigability.
- **Enforcement**: Accessibility violations are highlighted during development, ensuring compliance with WCAG standards before components are integrated into the main application.

## Best Practices
- Every component must have an associated `.stories.tsx` file.
- Stories must demonstrate various states (e.g., default, disabled, error, loading).
- All stories must pass the automated accessibility checks provided by `addon-a11y`.
