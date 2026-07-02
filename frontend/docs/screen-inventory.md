# Screen Inventory

## 1. Public / Unauthenticated
- **Splash Screen**: Initial loading and brand presentation.
- **Login**: Email/Phone input.
- **OTP Verification**: 6-digit code entry.
- **Registration Flow**: Multi-step stepper (Name, DOB, Gender, Interests, Photos).
- **Forgot Password**: Reset request and verification.

## 2. Core Platform (Authenticated)
### 2.1 Discovery
- **Discovery Feed (`/`)**: Main swiping interface.
- **Preferences (`/filters`)**: Usually opened as a Drawer or Modal over Discovery.
- **Match Celebration**: Transient overlay upon mutual like.

### 2.2 Interaction & Messaging
- **Matches Hub (`/matches`)**: Grid of new matches and list of active conversations.
- **Chat Room (`/chat/:id`)**: Real-time messaging view with a specific user.
- **User Profile Modal**: Viewing a match's full profile from the chat.

### 2.3 Profile & Identity
- **My Profile (`/profile`)**: Viewing own profile.
- **Edit Profile (`/profile/edit`)**: Updating bio, interests, and photos.
- **Verification (`/profile/verify`)**: Liveness check / photo upload for trust verification.
- **Settings (`/settings`)**: Account management, privacy, push notifications.

### 2.4 Growth
- **Premium Hub (`/premium`)**: Subscription management, feature unlocks, paywalls.
- **Rewards/Referrals (`/rewards`)**: Tracking invites and unlocked perks.

### 2.5 SparkOps (Admin Portal)
*Note: Hosted on a strictly separated route/subdomain.*
- **Dashboard (`/ops`)**: System health, active users, matches today.
- **User Management (`/ops/users`)**: Search, suspend, shadow-ban users.
- **Moderation Queue (`/ops/moderation`)**: Review flagged profiles/messages.
- **AI Analytics (`/ops/ai`)**: Token usage, costs, prompt evaluation.
