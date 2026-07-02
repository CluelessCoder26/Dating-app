# Button

## Purpose
The Button component is the primary interaction element for the application, used to trigger actions, submit forms, and navigate to different sections.

## Props
- `variant` (string): The style of the button (`primary`, `secondary`, `outline`, `ghost`).
- `size` (string): The size of the button (`sm`, `md`, `lg`).
- `disabled` (boolean): Whether the button is disabled.
- `isLoading` (boolean): Shows a loading spinner and disables the button.
- `leftIcon` (ReactNode): Icon to display before the label.
- `rightIcon` (ReactNode): Icon to display after the label.
- `onClick` (function): Click event handler.

## Variants
- **Primary**: Solid background with primary brand color.
- **Secondary**: Solid background with secondary brand color.
- **Outline**: Transparent background with a border.
- **Ghost**: Transparent background and border, appears on hover.

## Accessibility
- Uses standard `<button>` element with appropriate `type`.
- Supports focus states for keyboard navigation.
- Includes `aria-label` when no text content is provided.
- `aria-disabled` and `disabled` attributes managed appropriately.

## Animations
- **Hover**: Subtle scale-up (e.g., `scale(1.02)`) and background color transition.
- **Active**: Scale-down (e.g., `scale(0.98)`).
- **Loading**: Spinner animation.

## States
- **Loading**: Shows a spinner, hides or fades text, interaction disabled.
- **Error**: N/A for standard button, but can be customized with error colors.
- **Empty**: N/A.
- **Disabled**: Reduced opacity, pointer events disabled.

## Usage
Use buttons for distinct actions. Avoid using buttons for inline text links.

## Examples
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Connect
</Button>
```

## Screens using it
- Login Screen
- Onboarding Flow
- Settings
- Profile Editing
