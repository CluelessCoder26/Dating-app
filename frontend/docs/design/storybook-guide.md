# Storybook Guide

Storybook is our workshop for building, testing, and documenting components in isolation.

## How to Write Stories
1. **Colocation**: Place the story file next to the component (e.g., `Button.tsx` and `Button.stories.tsx`).
2. **Default Export**: Document the component's title (path) and the component itself.
3. **Template**: Create a base template for the component to reuse across stories.
4. **Variants**: Create a story for each significant variant or state (e.g., Primary, Secondary, Outline, Disabled).
5. **Interactive Stories**: Use Storybook's `play` function to simulate user interactions (clicks, typing) for automated testing.

## Documentation
- Use the `docs` addon to autogenerate documentation tables based on TypeScript interfaces or PropTypes.
- Add descriptive JSDoc comments to component props to ensure they appear in the Storybook docs.
