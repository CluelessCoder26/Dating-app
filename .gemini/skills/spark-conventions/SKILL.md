---
name: spark-conventions
description: Coding conventions, architecture, and rules for the Spark Dating App
---

# Spark Dating App — Conventions & Architecture

## NON-NEGOTIABLES
- **No mock data, placeholders, hardcoded users, or bypassed auth in production code paths**
- Seed/demo data ONLY via `backend/prisma/seed.js`
- No fake APIs or dummy responses — every FE call must hit a real backend route
- No skipped validation — validate before sending to backend
- Preserve existing architecture/conventions

## Tech Stack
- **Frontend:** React 19 + Vite + Tailwind CSS (v4 @theme in index.css + v3-style config)
- **Backend:** Express + Prisma (PostgreSQL) + Redis + BullMQ workers
- **WebSocket:** Standalone Socket.IO server on port 5001
- **Animations:** framer-motion (heavily used)
- **Icons:** Material Symbols (Google), NOT lucide

## Architecture Patterns
- **API layer:** Single `frontend/src/api.js` using raw `fetch()` — NOT axios
- **State:** Local `useState` in components, prop drilling from App.jsx. Zustand stores exist but are UNUSED.
- **Auth:** JWT in localStorage, `Authorization: Bearer` header
- **Socket:** `socket.io-client` connecting to `http://localhost:5001`
- **Backend REST:** Routes under `/api/` (also aliased as `/api/v1/`)
- **Socket events (legacy, used by FE):** `match_created`, `like_received`, `recv_msg`, `typing_status`, `send_msg`, `join_match`, `typing`
- **Socket events (modern, SocketManager):** `match.created`, `message.delivered`, `typing.start/stop`, `presence.update`

## Frontend Folder Structure
```
frontend/src/
├── api.js                     # ALL API + socket methods
├── App.jsx                    # Root component, tab navigation
├── components/                # Major page components (monoliths)
│   ├── DiscoveryCanvas.jsx    # Swipe feed
│   ├── MatchesAndChat.jsx     # Matches list + chat
│   ├── ProfileAndSettings.jsx # Profile editing + settings
│   ├── HeartTab.jsx           # Likes received
│   ├── OnboardingFlow.jsx     # Auth + profile creation
│   └── ui/                    # shadcn-style primitives (unused)
├── hooks/                     # Custom hooks (mostly unused)
├── store/                     # Zustand stores (unused by components)
└── utils/                     # Utilities (phone.js)
```

## Backend API Endpoints (key ones)
- Auth: `/api/auth/*` (register, login, verify-otp, me, refresh)
- Profile: `/api/profile` (GET/POST/PUT), `/api/profile/location`, `/api/profile/preferences`, `/api/profile/settings`
- Discovery: `/api/discovery` (GET feed), `/api/discovery/next`, `/api/discovery/preferences`
- Interactions: `/api/interactions/swipe`, `/api/interactions/likes-received`, `/api/interactions/stats`
- Swipe (legacy): `/api/swipe`, `/api/swipe/matches`, `/api/swipe/matches/:id/messages`
- Photos: `/api/photos/upload` (multer multipart), `/api/photos`, `/api/photos/primary`
- Trust: `/api/trust/report`, `/api/trust/block`
- Growth: `/api/growth/plans`, `/api/growth/subscriptions`, `/api/growth/entitlements`
- Chat: `/api/conversations`, `/api/messages`

## Discovery Feed Response Shape
```json
{
  "profiles": [
    {
      "userId": "...", "name": "...", "age": 25, "gender": "...",
      "bio": "...", "interests": ["..."], "occupation": "...",
      "latitude": 0, "longitude": 0, "elo": 1000,
      "photos": [{ "id": "...", "url": "...", "isPrimary": true, "order": 0 }],
      "user": { "id": "...", "lastLoginAt": "...", "emailVerified": true },
      "distanceMiles": 5.2, "recommendationScore": 85.5
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "hasMore": true, "nextCursor": "...", "count": 20 },
  "empty": false
}
```

## Swipe Response Shape
```json
{ "success": true, "action": "LIKE", "isMatch": false, "match": { "id": "..." } }
```
Valid actions: LIKE, PASS, SUPER_LIKE, BOOST, REWIND

## Style Conventions
- Color palette: blues (#EAF4FF, #DCEEFF, #B5D8FF, #92C4FF, #6FAEFF, #4F97FF, #005ab7)
- Text: #1a2b3c (primary), #2b4257 (secondary), #4a5f73 (muted)
- Fonts: Inter (sans), Playfair Display (serif)
- Glass effects: `bg-white/40 backdrop-blur-md border border-white/60`
- Rounded: `rounded-2xl` to `rounded-[32px]`
- Shadows: soft blue-tinted `shadow-[0_10px_30px_rgba(79,151,255,0.15)]`
