# SubscriptionCard

## Purpose
Displays the details, features, and pricing of a premium subscription tier, encouraging users to upgrade.

## Props
- `tierName` (string): Name of the tier (e.g., "Gold", "Platinum").
- `price` (string): Formatting price string (e.g., "$9.99/mo").
- `features` (Array<string>): List of features included in the tier.
- `isPopular` (boolean): Highlights the card as the most popular choice.
- `onSubscribe` (function): Handler for the subscription action.

## Variants
- **Standard**: Normal display of a tier.
- **Highlighted**: Emphasized card for the recommended or most popular tier.

## Accessibility
- Features list uses standard `<ul>` and `<li>` elements.
- Price is clearly read by screen readers.
- Action button is distinct and accessible.

## Animations
- **Hover**: Card elevates slightly.
- **Highlighted Pulse**: The highlighted variant may have a subtle, continuous glowing border or badge animation.

## States
- **Loading**: Button shows loading state during the checkout process.
- **Error**: Displays payment failure or error messages gracefully within or near the card.
- **Empty**: N/A.

## Usage
Used on the paywall or premium upgrade screens to present options to the user.

## Examples
```jsx
<SubscriptionCard 
  tierName="Premium"
  price="$14.99/mo"
  features={['Unlimited Likes', 'See Who Likes You', '5 Super Likes a day']}
  isPopular={true}
  onSubscribe={handleCheckout}
/>
```

## Screens using it
- Paywall / Upgrade Screen
- Settings (Subscription management)
