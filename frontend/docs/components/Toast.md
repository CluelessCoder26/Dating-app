# Toast

## Purpose
Provides brief, non-interruptive notifications to the user about system processes, success, or error messages.

## Props
- `message` (string): The text content of the notification.
- `type` (string): The severity or category (`success`, `error`, `info`, `warning`).
- `duration` (number): Time in milliseconds before the toast auto-dismisses (default: 3000ms).
- `onClose` (function): Handler when the toast is closed manually or automatically.

## Variants
- **Success**: Green background or icon indicating a successful action.
- **Error**: Red background or icon indicating a failure.
- **Info**: Blue/neutral background for general information.
- **Warning**: Yellow/orange background for cautionary messages.

## Accessibility
- Uses `role="alert"` or `role="status"` depending on the severity.
- `aria-live="polite"` or `"assertive"` so screen readers announce the message without requiring focus.

## Animations
- **Entrance**: Slides in from the top or bottom of the screen.
- **Exit**: Slides out or fades away when dismissed.

## States
- **Loading**: N/A.
- **Error**: N/A.
- **Empty**: N/A.

## Usage
Used globally to provide feedback on user actions (e.g., "Profile updated", "Message sent", "Connection failed").

## Examples
```jsx
<Toast 
  message="Your profile has been updated successfully!" 
  type="success" 
/>
```

## Screens using it
- Global (can appear on any screen)
