# Conversation Engine Architecture

## Purpose
Normalize chats away from strict 1:1 `Match` constraints. By implementing `Conversation` and `Participant` tables, we inherently grant the architecture the ability to scale into:
- Group Chats
- Admin Support Threads
- Multi-party verification checks

## Participant Flags
Every participant tracks isolated states natively:
- `isArchived`
- `isMuted`
- `isPinned`
- `lastReadAt`
