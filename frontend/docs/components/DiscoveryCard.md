# DiscoveryCard

## Purpose
The primary interactive element in the matching flow, designed for swiping (liking/passing) potential matches.

## Props
- `profile` (Object): The detailed profile data of the potential match.
- `onSwipeLeft` (function): Callback for passing.
- `onSwipeRight` (function): Callback for liking.
- `onSwipeUp` (function): Callback for super-liking.

## Variants
- **Standard**: The default swipeable card.
- **Expanded**: Tapping the card expands it to show full profile details.

## Accessibility
- Includes screen reader instructions for swiping actions (e.g., "Swipe left to pass, right to like").
- Keyboard navigable controls for liking, passing, and super-liking as alternatives to touch gestures.

## Animations
- **Swipe**: Physics-based spring animations for dragging and releasing the card.
- **Stamps**: "LIKE" and "NOPE" stamps fade in and scale up based on drag distance.
- **Return**: Card springs back to center if drag is released before the threshold.

## States
- **Loading**: Skeleton view of the discovery card.
- **Error**: Message indicating failure to load the next profile, with a retry button.
- **Empty**: "No more profiles around you" state with options to expand search criteria.

## Usage
Used exclusively in the main discovery/swipe interface.

## Examples
```jsx
<DiscoveryCard 
  profile={currentProfile}
  onSwipeRight={handleMatch}
  onSwipeLeft={handlePass}
/>
```

## Screens using it
- Main Discovery/Swipe Interface
