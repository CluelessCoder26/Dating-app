# Design System Readiness Report

## Executive Summary
This report outlines the strategy for extracting the existing custom CSS, Colors, Typography, and Framer Motion springs into a cohesive, scalable Tailwind CSS design token system integrated with `shadcn/ui`.

## 1. Extracting Colors to Design Tokens
Currently, colors are likely hardcoded in CSS files or scattered across components.
- **Strategy**: Map all brand colors (primary, secondary, background, foreground, muted, destructive) to CSS variables (`--primary`, `--background`) using HSL values.
- **Tailwind Integration**: Configure `tailwind.config.js` to read from these CSS variables.
- **Benefit**: This allows for dynamic theming (Dark/Light mode) out of the box, perfectly aligning with `shadcn/ui`'s structure.

## 2. Standardizing Typography
- **Strategy**: Extract font families (e.g., Inter, Poppins), sizes, line-heights, and weights.
- **Tailwind Integration**: Map these to Tailwind's typography system. Extend `fontFamily` in the Tailwind config and utilize default sizing/leading classes. 
- **Benefit**: Ensures consistent heading hierarchy and readability across the app without bespoke CSS classes.

## 3. Unifying Framer Motion Springs & Animations
Animation configurations are currently duplicated across different components.
- **Strategy**: Create a centralized `animations.js` file defining standard Framer Motion springs, transitions, and variants.
  ```javascript
  export const springConfig = { type: 'spring', stiffness: 300, damping: 30 };
  export const slideUpVariant = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
  ```
- **Tailwind Integration**: For simpler animations (hover effects, basic transitions), define them as custom Tailwind plugins or in `theme.extend.animation` in `tailwind.config.js`.

## 4. Integrating shadcn/ui
With tokens in place, we can adopt `shadcn/ui`.
- **Why shadcn/ui?**: It provides accessible, unstyled components that we own and can completely customize.
- **Implementation**: We will install the base shadcn/ui components (Buttons, Dialogs, Inputs, Cards). They will automatically inherit our Tailwind color tokens, typography, and border radiuses.

## Next Steps
1. Audit existing `App.css` and `index.css` to catalog all unique hex codes and font sizes.
2. Initialize Tailwind and set up the `globals.css` with the foundational HSL variables.
3. Replace custom base components with `shadcn/ui` components one by one, ensuring zero visual regressions.
