# Responsive Layouts

Spark is designed mobile-first. We use standard breakpoints to adapt the layout to various screen sizes.

## Breakpoints
- **sm**: `640px` (Large phones, small tablets)
- **md**: `768px` (Tablets, landscape phones)
- **lg**: `1024px` (Laptops, small desktops)
- **xl**: `1280px` (Desktops)
- **2xl**: `1536px` (Large displays)

## Strategies
- **Mobile First**: Write base styles for the smallest screens, then use `min-width` media queries to add styles for larger screens.
- **Fluid Layouts**: Prefer percentage-based widths, flexbox, and CSS Grid over fixed pixel widths.
- **Touch Targets**: Ensure all interactive elements have a minimum size of 44x44px on mobile devices.
