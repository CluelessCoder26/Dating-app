# PublicLayout

## Purpose
The structural wrapper for publicly accessible pages (e.g., landing page, login, signup, about us). It provides common elements like the global public navigation bar and footer.

## Props
- `children` (ReactNode): The main page content.
- `showFooter` (Boolean, default: true): Whether to render the footer.
- `transparentNav` (Boolean, default: false): Whether the navigation bar should be transparent (useful for hero images).

## Variants
- `standard`: Solid navigation bar.
- `hero`: Transparent navigation bar that becomes solid on scroll.
- `minimal`: Hides footer and minimal nav for focused flows (like login).

## Accessibility
- Defines main landmarks (`<header>`, `<main>`, `<footer>`).
- Skip to content link included at the top of the layout for keyboard users.
- Ensures focus is managed correctly across page transitions.

## Animations
- Navigation bar background transition on scroll (if `transparentNav` is true).
- Page transition animations (fade in/out) for routing.

## States
- N/A (Layout component generally does not have complex states, depends on children).

## Usage
Wraps all route components that do not require authentication.

## Examples
```jsx
<PublicLayout transparentNav={true}>
  <LandingPageHero />
  <FeaturesSection />
</PublicLayout>
```

## Related Components
- `PublicNavbar`: The navigation bar used within this layout.
- `PublicFooter`: The footer used within this layout.
- `AppLayout`: The layout used for authenticated screens.

## Screens Using Component
- Landing Page
- Login Screen
- Registration Screen
- Terms of Service
