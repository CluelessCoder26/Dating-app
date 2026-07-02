# RewardCard

## Purpose
Displays a gamification reward, badge, or achievement unlocked by the user.

## Props
- `title` (string): Name of the reward.
- `description` (string): How the reward was earned or what it provides.
- `icon` (ReactNode): Visual representation of the reward.
- `isUnlocked` (boolean): Whether the user has achieved this reward.
- `progress` (number): Progress towards unlocking (0-100).

## Variants
- **Unlocked**: Full color, showing achievement.
- **Locked**: Grayscale or dim, showing potential.
- **In Progress**: Shows a progress bar indicating how close the user is.

## Accessibility
- Icon includes descriptive `alt` text.
- Progress bar utilizes `role="progressbar"` and `aria-valuenow`.

## Animations
- **Unlock Sequence**: Elaborate animation (e.g., confetti, glowing, bouncing) when transitioning from locked to unlocked state.
- **Hover**: Slight tilt or shine effect for unlocked rewards.

## States
- **Loading**: Skeleton state while fetching user achievements.
- **Error**: N/A.
- **Empty**: N/A.

## Usage
Used in the user's profile or a dedicated achievements section to encourage engagement.

## Examples
```jsx
<RewardCard 
  title="Chatterbox"
  description="Send 100 messages"
  icon={<ChatIcon />}
  isUnlocked={false}
  progress={75}
/>
```

## Screens using it
- User Profile
- Achievements/Gamification Hub
