# AIInsightCard

## Purpose
Displays AI-generated insights, advice, or compatibility analysis to the user based on their profile and interactions.

## Props
- `title` (string): The title of the insight.
- `content` (string): The main body text of the insight.
- `type` (string): The type of insight (`compatibility`, `profile-tip`, `conversation-starter`).
- `confidence` (number): AI confidence score (0-100).
- `onDismiss` (function): Handler to dismiss the card.

## Variants
- **Banner**: A thin banner for quick tips.
- **Card**: A standard card for detailed analysis.
- **Modal**: Pops up for significant insights.

## Accessibility
- Proper heading hierarchy for the title.
- Content is easily readable.
- Dismiss button is accessible via keyboard and has an `aria-label`.

## Animations
- **Entrance**: Fades in and slides up gently.
- **Dismiss**: Fades out and shrinks slightly before unmounting.
- **Highlight**: Pulsing border or icon to draw attention to new insights.

## States
- **Loading**: Shimmer effect on text lines while the AI is generating the insight.
- **Error**: "Failed to load insight" message with a retry option.
- **Empty**: N/A.

## Usage
Used to provide value-added features powered by AI, such as profile optimization suggestions or icebreakers.

## Examples
```jsx
<AIInsightCard 
  title="Conversation Starter" 
  content="Ask about their recent trip to Italy mentioned in their bio!"
  type="conversation-starter" 
/>
```

## Screens using it
- Chat Interface (Icebreakers)
- Profile Editing (Tips)
- Match Details (Compatibility analysis)
