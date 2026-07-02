# Color System

Our color system relies on semantic tokens to ensure seamless switching between Light and Dark themes, avoiding hardcoded values.

## Core Palettes

### Primary
The primary color represents the brand and main actions.
- `primary-50` to `primary-900`
- Semantic usage: `var(--color-primary)`, `var(--color-primary-hover)`, `var(--color-primary-active)`

### Secondary & Accents
Supporting colors to complement the primary brand color.
- Semantic usage: `var(--color-secondary)`, `var(--color-accent)`

### Neutrals
Used for backgrounds, text, and borders.
- Light Mode: White background, dark grey text.
- Dark Mode: Dark grey background, off-white text.

## Semantic Colors
- **Success**: Indicates completion or positive states (e.g., green).
- **Warning**: Indicates caution (e.g., yellow/orange).
- **Destructive / Error**: Indicates destructive actions or errors (e.g., red).
- **Info**: Highlights general information (e.g., blue).

## Themes
- **Light Theme**: Bright backgrounds, high contrast text.
- **Dark Theme**: Deep, rich backgrounds to reduce eye strain in low light.
*Never hardcode hex values in CSS or inline styles; use CSS variables.*
