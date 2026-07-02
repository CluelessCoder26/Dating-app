# Spark Design System

## 1. Design Tokens

### 1.1 Typography
- **Primary Font**: Inter (Clean, legible, modern).
- **Headings**: H1 (4xl), H2 (3xl), H3 (2xl), H4 (xl). Weight: Bold (700) or SemiBold (600).
- **Body**: Base (16px), Sm (14px). Weight: Normal (400) or Medium (500).

### 1.2 Color System
*Respecting the existing visual identity:*
- **Primary Brand**: `--color-brand` (Pink/Red gradient spectrum).
- **Background (Dark Mode Default)**: `--color-background` (Deep charcoal / almost black for premium feel).
- **Surface**: `--color-surface` (Slightly lighter than background, for cards and modals).
- **Text Primary**: `--color-text-primary` (High contrast white/off-white).
- **Text Secondary**: `--color-text-secondary` (Muted gray for timestamps, secondary labels).
- **Semantic**: 
  - Success: `--color-success` (Green)
  - Warning: `--color-warning` (Amber)
  - Error: `--color-error` (Red)
  - Info: `--color-info` (Blue)

### 1.3 Spacing & Grid
- **Base Unit**: 4px (Tailwind standard).
- **Spacing Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Grid**: 12-column responsive grid.
  - Mobile: 4 cols, 16px margins.
  - Tablet: 8 cols, 24px margins.
  - Desktop: 12 cols, max-width 1200px.

### 1.4 Elevation & Shadows
- **Level 1**: Subtle drop shadow for cards (`shadow-sm`).
- **Level 2**: Medium shadow for dropdowns/popovers (`shadow-md`).
- **Level 3**: Pronounced shadow for modals/dialogs (`shadow-lg`).
- **Glow**: Custom brand-colored glow for premium features (`shadow-[0_0_15px_rgba(brand)]`).

### 1.5 Radii (Border Radius)
- **Small**: 4px (Checkboxes, small tags).
- **Medium**: 8px (Buttons, inputs).
- **Large**: 16px (Cards, dialogs).
- **Full**: 9999px (Avatars, pills).

### 1.6 Animation & Motion (Framer Motion)
- **Spring Defaults**: `stiffness: 300, damping: 25`.
- **Transitions**: Ease-in-out (`duration: 0.2s`).
- **Micro-interactions**: Hover scale (`1.02`), Tap scale (`0.95`).
- **Reduced Motion**: Respect `prefers-reduced-motion` media query by disabling scale and spring animations.

## 2. Accessibility Tokens
- **Focus Rings**: Highly visible outline (`ring-2 ring-brand ring-offset-2`).
- **Contrast**: Enforce WCAG AA minimum contrast ratio (4.5:1 for normal text).
- **ARIA**: Semantic mapping mapped directly into the primitive components.
