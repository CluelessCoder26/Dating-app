# Relationship Memory Engine

## Spark's Signature Feature
Every match accumulates a persistent memory timeline:
- **Shared Topics**: Extracted from conversation AI analysis.
- **Shared Interests**: Profile overlap.
- **Summary**: AI-generated relationship narrative.
- **Conversation Highlights**: Key moments.

## Privacy
- No raw messages stored in memory.
- Only AI-extracted metadata persisted.
- Memory is keyed to `matchId`, not user IDs.

## Update Flow
When `updateFromConversation` is called, the engine:
1. Fetches the last 50 messages.
2. Sends content to AIGateway for topic extraction.
3. Updates `RelationshipMemory` and `ConversationSummary`.
