# ProfileCard

## Purpose
Displays a concise summary of a user's profile, typically in a list or grid view, before showing full details.

## Props
- `user` (Object): User data containing name, age, location, photos, and matching percentage.
- `onLike` (function): Handler for the like action.
- `onPass` (function): Handler for the pass action.
- `isBlurred` (boolean): Whether the profile should be blurred (e.g., for non-premium users viewing who liked them).

## Variants
- **Standard**: Shows basic info and primary photo.
- **Compact**: Smaller version for grids or lists.
- **Detailed**: Expanded version showing more information.

## Accessibility
- Image includes appropriate `alt` text.
- Action buttons (`Like`, `Pass`) have clear `aria-label`s.
- Entire card is focusable if it acts as a link to the full profile.

## Animations
- **Hover**: Subtle lift (box-shadow increase) and image slight zoom.
- **Swipe Actions**: Smooth translation and rotation based on swipe direction, fading out upon completion.

## States
- **Loading**: Skeleton loader showing the shape of the card, image, and text lines.
- **Error**: Fallback UI if user data or image fails to load.
- **Empty**: N/A.

## Usage
Used primarily in the discovery feed or match lists to present potential connections.

## Examples
```jsx
<ProfileCard 
  user={userData} 
  onLike={() => handleLike(userData.id)} 
  onPass={() => handlePass(userData.id)} 
/>
```

## Screens using it
- Discovery Feed
- Matches List
- Likes You Screen
