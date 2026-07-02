# Component & Storybook Documentation

## 1. Shadcn/ui Foundation
The UI library is built using Radix UI primitives wrapped in Tailwind CSS, provisioned by `shadcn/ui`. This ensures components are fully accessible (ARIA, keyboard navigation) by default.

## 2. Component Implementation Standards
1. **Separation of Logic**: UI components must be "dumb". They accept props and emit events. They should not directly call `Axios` or `useQuery`.
2. **Variants**: Use `cva` (Class Variance Authority) to manage component variants (e.g., `intent: primary | secondary`, `size: sm | md | lg`).
3. **Forwarding Refs**: All interactive components must wrap themselves in `React.forwardRef` to support complex animations and focus management.

## 3. Storybook Guidelines
To run the component explorer: `npm run storybook`

### Writing Stories
Every component must have a corresponding `.stories.tsx` file.
```tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Swipe Right',
  },
};
```

### Required Addons
- `@storybook/addon-essentials`: Controls, Docs, Viewport.
- `@storybook/addon-a11y`: Validates WCAG compliance on the rendered story.
- `@storybook/addon-interactions`: For simulating click/type events in component tests.
