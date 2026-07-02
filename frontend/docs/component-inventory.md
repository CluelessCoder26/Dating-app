# Component Inventory

## 1. Primitives (shadcn/ui based)
These components form the atomic layer of the UI.
- **Button**: Variants (Primary, Secondary, Outline, Ghost, Link). Sizes (sm, md, lg, icon).
- **Input / Textarea**: With error states, floating labels, and accessible focus rings.
- **Avatar**: Image with fallback initials. Sizes (sm, md, lg, xl).
- **Badge / Tag**: For interests, status indicators.
- **Card**: Container with standardized padding, border, and background.
- **Dialog / Modal**: Centered overlay for critical prompts.
- **Drawer**: Bottom-sheet for mobile interactions (filters, settings).
- **Dropdown Menu**: Accessible popovers for actions.
- **Toast**: Ephemeral system notifications.
- **Tooltip**: Contextual help on hover/focus.
- **Skeleton**: Loading placeholders.
- **Carousel**: Swiping photo galleries.
- **Tabs**: Navigation between related views.

## 2. Domain Components

### 2.1 Profile & Identity
- `ProfileCard`: Displays user photo, name, age, and bio.
- `PhotoGrid`: 3x2 grid for managing uploaded photos.
- `TrustBadge`: Visual indicator of verification level (AI verified, manual).

### 2.2 Discovery & Interaction
- `SwipeDeck`: Framer-motion powered tinder-style swiping interface.
- `MatchOverlay`: Full-screen celebration animation when a match occurs.
- `FilterDrawer`: Slide-up drawer for age, distance, and preference filters.

### 2.3 Messaging
- `ConversationList`: Scrollable list of active chats with unread indicators.
- `MessageBubble`: Sent/Received message bubbles with read receipts.
- `ChatInput`: Text input with attachment and emoji support.

### 2.4 Growth & Monetization
- `PremiumPaywall`: Feature breakdown for Platinum upgrades.
- `AchievementBadge`: Visual unlocks for user milestones.

### 2.5 AIOS & Operations
- `AIInsightCard`: Highlights compatibility scores and generated icebreakers.
- `ModerationBanner`: System warning/informational banner.
