# Accessibility (a11y)

Spark is committed to providing an inclusive experience for all users.

## Core Standards
- **WCAG 2.1 AA**: All components must comply with these guidelines.
- **Contrast**: Text and interactive elements must have a contrast ratio of at least 4.5:1 (3:1 for large text).

## Keyboard Navigation
- All interactive elements must be focusable via the `Tab` key.
- The focus order must be logical and predictable (typically following the DOM order).
- **Visible Focus**: Never remove the focus outline (`outline: none`) without providing a distinct, custom focus indicator (e.g., a solid ring).

## ARIA (Accessible Rich Internet Applications)
- **First Rule of ARIA**: No ARIA is better than bad ARIA. Use native semantic HTML whenever possible.
- Use `aria-label` or `aria-labelledby` when a visible text label is absent.
- Ensure state attributes like `aria-expanded`, `aria-checked`, or `aria-disabled` are accurately maintained by component logic.
- Use `aria-live` regions for important dynamic content updates.
