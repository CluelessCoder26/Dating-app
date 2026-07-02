# MatchCard

## Purpose
Displays a potential match's profile summary, including photo, name, age, location, and key interests, allowing users to make swipe decisions (like or pass).

## Props
- `profile` (Object): The match profile data (id, name, age, location, photoUrl, interests, bio).
- `onLike` (Function): Callback when the user likes the profile (e.g., right swipe).
- `onPass` (Function): Callback when the user passes on the profile (e.g., left swipe).
- `onSuperLike` (Function, optional): Callback for super like action.
- `isActive` (Boolean): Whether this card is currently the active/top card in the stack.

## Variants
- `default`: Standard match card layout with full-bleed image and gradient overlay for text.
- `compact`: Smaller version for list views or grids.
- `detailed`: Expanded view showing more profile details below the image.

## Accessibility
- Uses `aria-label` for action buttons (Like, Pass, Super Like).
- Keyboard navigable: Arrow keys can be used to trigger swipe actions when the card is focused.
- Screen reader announces the profile name and age when focused.
- High contrast text overlay for readability over images.

## Animations
- Entrance: Slides in from the bottom or fades in.
- Swipe: Draggable with spring physics. Swiping right shows a green "LIKE" stamp; swiping left shows a red "NOPE" stamp.
- Exit: Animates off-screen in the direction of the swipe.
- Snap back: Returns to center if released before the swipe threshold.

## States
- `loading`: Skeleton loader while profile image is fetching.
- `default`: Normal interactive state.
- `swiping`: Actively being dragged.
- `error`: Failed to load image placeholder.

## Usage
Used primarily in the main discovery feed (the "swipe stack").

## Examples
```jsx
<MatchCard 
  profile={{
    name: "Alex",
    age: 28,
    location: "New York, NY",
    photoUrl: "/images/profiles/alex.jpg",
    interests: ["Hiking", "Coffee"]
  }}
  onLike={() => handleLike(profile.id)}
  onPass={() => handlePass(profile.id)}
/>
```

## Related Components
- `MatchStack`: Container for multiple `MatchCard`s.
- `ProfileDetails`: Expanded view of a match.
- `SwipeActionButtons`: The buttons that trigger the swipe callbacks.

## Screens Using Component
- Discovery/Swipe Feed Screen
