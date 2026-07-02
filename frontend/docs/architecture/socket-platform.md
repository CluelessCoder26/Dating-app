# Socket Platform Architecture

## Overview
The Dating App relies heavily on real-time features such as instant messaging, online status indicators, and real-time match notifications. We use **Socket.io-client** for WebSocket communication.

## Connection Management
- The Socket connection is established in a custom React hook `useSocketConnection()` which is consumed by the `SocketProvider` at the root level.
- The connection requires the user to be authenticated. The JWT token is passed in the socket `auth` payload during connection setup.
- Disconnection and cleanup are handled automatically when the user logs out or the window unloads.

## Event Handling
To prevent components from becoming bloated with socket event listeners, we delegate socket event handling to custom hooks per feature domain.

For example, `useChatSocket(conversationId)`:
1. Listens for `receive_message` events.
2. Upon receiving a message, it updates the local React Query cache for the message list immediately, ensuring instant UI updates without requiring a full refetch.

## Fallbacks
Socket.io handles polling fallbacks automatically if WebSockets are unavailable.
