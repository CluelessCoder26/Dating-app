# Analytics and Tracking

## Event Taxonomy
We track key user interactions to improve the matchmaking algorithm and user experience:
- `user_signup`: Registration completed.
- `profile_complete`: User finished onboarding.
- `swipe_right` / `swipe_left`: Interaction on the feed.
- `match_created`: A mutual like occurred.
- `message_sent`: User sent a chat message.

## Implementation Details
- **Tooling**: We use a unified analytics wrapper (e.g., Segment or a custom SDK) to dispatch events to our data warehouse.
- **Privacy First**: No PII (Personally Identifiable Information) is sent in raw event payloads. User IDs are anonymized where required.
- **Opt-out Mechanism**: Users in GDPR/CCPA jurisdictions can opt out of non-essential tracking via the Privacy Settings panel.
