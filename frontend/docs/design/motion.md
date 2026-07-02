# Motion

Motion makes the Spark UI feel dynamic and alive. We primarily use Framer Motion for complex animations and CSS transitions for simple state changes.

## Easing Functions
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` - For most interactions.
- **Decelerate (Out)**: `cubic-bezier(0.0, 0, 0.2, 1)` - For entering elements.
- **Accelerate (In)**: `cubic-bezier(0.4, 0, 1, 1)` - For exiting elements.
- **Spring**: Used in Framer Motion for natural, playful interactions (bouncy).

## Durations
- **Fast**: `150ms` (Hover states, simple toggles)
- **Normal**: `250ms` (Dropdowns, simple modals)
- **Slow**: `350ms` (Page transitions, complex orchestrations)

## Reduced Motion
Accessibility is critical. Always respect the user's OS-level reduced motion settings.
- Implement `prefers-reduced-motion: reduce` in CSS.
- In Framer Motion, utilize the `useReducedMotion` hook to conditionally disable or simplify animations (e.g., swapping slides/scales for simple crossfades).
