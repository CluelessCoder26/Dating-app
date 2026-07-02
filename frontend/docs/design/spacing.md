# Spacing

Spark relies on a strict **4px grid** for all margins, padding, and layout spacing. This ensures rhythm and consistency across the interface.

## Spacing Scale
Our token values map to multiples of 4px. Use these tokens exclusively (via CSS variables or utility classes).

- `space-1`: 4px (0.25rem)
- `space-2`: 8px (0.5rem)
- `space-3`: 12px (0.75rem)
- `space-4`: 16px (1rem)
- `space-5`: 20px (1.25rem)
- `space-6`: 24px (1.5rem)
- `space-8`: 32px (2rem)
- `space-10`: 40px (2.5rem)
- `space-12`: 48px (3rem)
- `space-16`: 64px (4rem)

## Guidelines
- **Micro-adjustments**: Avoid using 1px or 2px spacing unless absolutely necessary for borders or optical alignment.
- **Consistency**: Use the same spacing variable for related layout components (e.g., standardizing gap between cards).
