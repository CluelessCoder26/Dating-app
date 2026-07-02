# Border Radius

Border radii help define the shape and feel of our UI. We use a standardized scale to ensure elements feel cohesive.

## Scale
- `radius-none`: 0px (Sharp edges)
- `radius-sm`: 4px (Subtle rounding for small elements like checkboxes)
- `radius-md`: 8px (Default for inputs, buttons, and small cards)
- `radius-lg`: 12px (For larger cards and modals)
- `radius-xl`: 16px (For prominent UI sections or bottom sheets)
- `radius-2xl`: 24px (For major structural containers)
- `radius-full`: 9999px (For circular elements like avatars and pills)

## Guidelines
- **Nesting**: When nesting rounded elements, ensure the inner radius is mathematically smaller than the outer radius to avoid optical distortion.
- **Consistency**: Stick to the tokens; do not use arbitrary pixel values.
