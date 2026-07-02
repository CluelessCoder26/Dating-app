# API Mapping

This document maps the Frontend Platform to the Phase 12 Backend API Contracts.
We use `Axios` + `React Query` (`@tanstack/react-query`) for all data fetching.

## 1. Authentication (Identity Platform)
- `POST /api/auth/register` -> `useRegister()`
- `POST /api/auth/login` -> `useLogin()`
- `POST /api/auth/refresh` -> Axios Interceptor (Automated)
- `POST /api/auth/logout` -> `useLogout()`

## 2. User & Profile Platform
- `GET /api/profile` -> `useMyProfile()`
- `PUT /api/profile` -> `useUpdateProfile()`
- `POST /api/photos/upload` -> `useUploadPhoto()` (Multipart)
- `DELETE /api/photos/:id` -> `useDeletePhoto()`

## 3. Discovery Platform
- `GET /api/discovery/feed` -> `useDiscoveryFeed()` (Infinite Query)
- `POST /api/discovery/preferences` -> `useUpdatePreferences()`

## 4. Interaction Engine
- `POST /api/interactions/swipe` -> `useSwipe()` (Optimistic Update)
- `GET /api/interactions/matches` -> `useMatches()`

## 5. Real-Time Relationship Platform (Messaging)
- **Sockets**: Connected via `Socket.IO` namespace `/`.
- `GET /api/conversations` -> `useConversations()`
- `GET /api/conversations/:id/messages` -> `useMessages()` (Infinite Query)
- `POST /api/conversations/:id/messages` -> `useSendMessage()`

## 6. Trust Platform
- `POST /api/trust/report` -> `useReportUser()`
- `POST /api/trust/block` -> `useBlockUser()`

## 7. Growth Platform
- `GET /api/growth/subscription` -> `useSubscriptionStatus()`
- `POST /api/growth/subscribe` -> `useSubscribe()`

## 8. AIOS Platform
- `GET /api/ai/compatibility/:userId` -> `useAICompatibility()`
- `GET /api/ai/icebreakers/:userId` -> `useAIIcebreakers()`

## 9. SparkOps (Admin)
- `GET /api/ops/dashboard` -> `useOpsDashboard()`
- `GET /api/ops/system` -> `useOpsSystemHealth()`
- `GET /api/ops/incidents` -> `useOpsIncidents()`
