# Theming (Light & Dark Mode)

Spark supports first-class theming, primarily focused on Light and Dark modes.

## Implementation
- **CSS Variables**: All theme-dependent colors must be defined as CSS variables attached to the `:root` and `.dark` selectors.
- **System Preference**: Default to the user's system preference (`prefers-color-scheme`).
- **Manual Override**: Allow users to explicitly choose Light or Dark mode, saving their preference to local storage or a cookie.

## Best Practices
- **Contrast**: Ensure both themes maintain WCAG AA contrast ratios.
- **Avoid Hardcoding**: Never use absolute colors like `#FFFFFF` or `#000000` in component styles.
- **Elevation in Dark Mode**: Rely on lighter surface colors and subtle borders rather than heavy drop shadows to denote elevation in dark mode.
