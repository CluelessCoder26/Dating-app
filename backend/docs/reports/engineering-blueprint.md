# Dating App Engineering Blueprint

## 1. Repository Overview

This repository contains a full-stack dating application separated into multiple interconnected components. 

- **Frontend:** A React 19 application built with Vite and Tailwind CSS. It acts as a Single Page Application (SPA) managing routing via local state rather than a dedicated router.
- **Backend API:** An Express.js REST API providing core functionalities like authentication, profile management, and swiping logic.
- **Websocket Server:** A standalone Node.js server handling real-time bidirectional communication for chat and presence, scaled via Redis adapter.
- **Worker Service:** A BullMQ background job processor handling intensive tasks like ELO recalculation, asynchronous message persistence, and push notifications.
- **Database:** PostgreSQL accessed via Prisma ORM.
- **Infrastructure:** Configured with Docker Compose for PostgreSQL (PostGIS) and Redis.

## 2. Frontend Overview

The frontend is the source of truth for user interactions and expected functionality.

- **Architecture:** React SPA using custom state-based routing (`activeTab` in `App.jsx`).
- **State Management:** React `useState` and `useEffect` with manual propagation of context (e.g., `myProfile`, `token`).
- **Core Views:**
  - `Splash.jsx`: Initial loading screen.
  - `OnboardingFlow.jsx`: Multi-step registration, OTP, and initial profile creation.
  - `DiscoveryCanvas.jsx`: The swiping interface.
  - `MatchesAndChat.jsx`: Lists matches and provides the messaging interface.
  - `HeartTab.jsx`: Premium/Favorites hub (PlatinumHub).
  - `ProfileAndSettings.jsx`: User configuration and photo management.
- **API Integration:** Centralized in `api.js` using `fetch` with Bearer tokens. Includes an embedded Socket.io client instantiation.
- **Socket Usage:** Listens for `recv_msg`, `match_created`, `typing_status`. Emits `join_match`, `typing`, `send_msg`.

## 3. Backend Overview

The backend is partially implemented and composed of three distinct Node.js services.

- **API Server (`backend/src/index.js`):**
  - Uses Express with direct route definitions (no controller/service layer separation).
  - Middleware: CORS, JSON/URL-encoded parsing (10mb limit), JWT validation (`auth.middleware.js`).
  - Routes: `/auth`, `/profile`, `/swipe`, `/photos`, `/block`.
- **Websocket Server (`websocket/src/index.js`):**
  - Standalone Socket.io server on port 5001.
  - Authenticates via JWT in the socket handshake.
  - Uses Redis for Pub/Sub and scaling. Offloads DB writes to BullMQ.
- **Worker Service (`worker/src/index.js`):**
  - BullMQ workers consuming jobs from Redis.
  - Handles `eloQueue`, `msgPersistenceQueue`, `pushNotificationQueue`.

## 4. Database Report (PostgreSQL / Prisma)

### Models & Relations
- `User`: Core account (phone, email, passwordHash). 1:1 relation with `Profile`.
- `Otp`: Ephemeral table for verification codes.
- `Profile`: Demographics, preferences, location (lat/lon), and ELO score. 1:M with `Photo`.
- `Photo`: Profile image URLs with an `isPrimary` flag.
- `Swipe`: Records user actions (like/nope).
- `Match`: Created when mutual 'like' swipes occur.
- `Message`: Chat history between matched users.
- `Block`: Unidirectional user blocks.

### Constraints & Indexes
- **Unique Constraints:** `User.phone`, `User.email`, `Otp.email`, `Profile.userId`, `Swipe.[swiperId, targetId]`, `Block.[blockerId, blockedId]`.
- **Indexes:** Applied on `Swipe.swiperId`, `Swipe.targetId`, `Match.user1Id`, `Match.user2Id`, `Message.matchId`, `Message.createdAt`, `Block.blockerId`.
- **Cascade Deletes:** Present on `Profile -> User` and `Photo -> Profile`.

### Issues
- **Missing Indexes:** `Profile.latitude` and `Profile.longitude` lack spatial indexes.
- **Security:** `Otp` codes are stored in plain text.
- **Performance:** Distance calculation in queries is not leveraging PostGIS features, leading to inefficient row-by-row calculations in JS.

## 5. API Contract

| Method | Endpoint | Auth | Request Body | Response Shape | Notes |
|--------|----------|------|--------------|----------------|-------|
| POST | `/api/auth/register` | No | `{ phone, email, password }` | `201 { step, email, message }` | Sends OTP |
| POST | `/api/auth/verify-otp` | No | `{ email, code }` | `200 { token, message }` | Returns JWT |
| POST | `/api/auth/login` | No | `{ identifier, password }` | `200 { token }` | |
| GET | `/api/auth/me` | Yes | None | `200 { profile }` | Includes photos |
| POST | `/api/profile` | Yes | `{ name, age, gender, preference, bio, lat, lon }` | `200 { profile }` | Upserts profile |
| GET | `/api/profile/discover` | Yes | Query: `maxDistance` | `200 [Profile]` | Calculates distance in JS |
| GET | `/api/profile/:userId` | Yes | None | `200 Profile` | Calculates relative distance |
| POST | `/api/swipe` | Yes | `{ targetId, rating }` | `200 { isMatch, match? }` | Enqueues ELO job |
| GET | `/api/swipe/matches` | Yes | None | `200 [{ matchId, profile }]` | |
| GET | `/api/swipe/matches/:id/messages`| Yes | None | `200 [Message]` | |
| POST | `/api/swipe/matches/:id/read` | Yes | None | `200 { success }` | Marks messages read |
| POST | `/api/photos/upload` | Yes | `{ url?, photoData?, isPrimary }` | `200 { photo }` | Saves base64 to local disk |
| DELETE | `/api/photos/:photoId` | Yes | None | `200 { success }` | |
| POST | `/api/block` | Yes | `{ blockedId }` | `200 { success }` | Removes matches/swipes |
| DELETE | `/api/block/:blockedId` | Yes | None | `200 { success }` | |
| GET | `/api/block` | Yes | None | `200 [{ id, blockedId, blockedPhone }]` | |

**Mismatches with Frontend:**
- Frontend calls `/api/report` but backend has no route for it.
- Frontend calls `/api/insights` but backend has no route for it.

## 6. Socket Contract

**Namespace:** `/` (Default)
**Authentication:** JWT passed in `auth: { token }` during connection handshake.

**Rooms:**
- `user_{userId}`: Personal room for targeted events (new messages, new matches).
- `match_{matchId}`: Shared room for active typing indicators.

**Events Emitted by Client:**
- `join_match` (payload: `{ matchId }`)
- `typing` (payload: `{ matchId, isTyping }`)
- `send_msg` (payload: `{ matchId, targetUserId, text, isImage }`)

**Events Listened by Client:**
- `recv_msg` (payload: `{ id, matchId, senderId, text, isImage, createdAt }`)
- `typing_status` (payload: `{ userId, isTyping }`)
- `match_created` (payload: `{ matchId, user1Id, user2Id }`)

**Missing/Issues:**
- No explicit reconnect strategy defined in the frontend socket configuration.
- Read receipts are handled via REST API (`/matches/:id/read`) rather than real-time socket events.

## 7. Redis Report

Redis is utilized heavily across the architecture but includes resilient fallback mechanisms.

- **Caching:** Currently NOT used for caching database queries (e.g., profiles, matches).
- **Queues (BullMQ):** Powers `eloQueue`, `msgPersistenceQueue`, and `pushNotificationQueue`.
- **Socket.io Scaling:** `@socket.io/redis-adapter` is used to sync messages across multiple websocket instances.
- **Pub/Sub:** Utilizes `match_events` channel to notify the websocket server when the REST API creates a new match.
- **Presence:** Maintains an `online_users` Set to determine if push notifications should be dispatched.

## 8. Security Review

- **Authentication:** Standard JWT (30-day expiry). No refresh token rotation implemented.
- **Password Storage:** Hashed securely using `bcrypt` (10 rounds).
- **Rate Limiting:** Basic rate limiting exists ONLY on `/auth` routes (15 req / 15 mins) tied to IP memory map (non-distributed).
- **Validation:** Strong schema validation using `zod`.
- **Vulnerabilities:**
  - File Uploads: Base64 image data is parsed via RegEx and saved to disk. No magic number/MIME type verification, leaving it vulnerable to malicious file execution if served incorrectly.
  - Secret Management: Defaults to `fallback_secret_key_123` if environment variables are missing.
  - Distance API: The `/profile/discover` endpoint calculates distance in JS, meaning it pulls excessive user data into memory before filtering, leading to potential Denial of Service (DoS) at scale.

## 9. Performance Review

- **N+1 Queries:** Present in `/swipe/matches` and `/block` endpoints where mapped arrays trigger individual `prisma.profile.findUnique` or `prisma.user.findUnique` calls inside a `Promise.all`.
- **Database Optimization:** The app relies on JS-based Haversine formula for distance rather than native PostGIS `ST_Distance`. This is a critical bottleneck for a dating application.
- **Pagination:** Completely missing. `/discover` and `/messages` will return unbound arrays, consuming massive bandwidth and memory over time.
- **Caching:** Profiles and frequently accessed discovery data are not cached in Redis.

## 10. Architecture Review

- **Separation of Concerns:** Poor. Route handlers in the backend contain routing logic, validation, business logic, and database access.
- **Dependency Flow:** Tightly coupled. Moving to a Controller -> Service -> Repository pattern is strictly necessary for maintainability.
- **Duplication:** Distance calculation logic is duplicated in `profile.js` and `swipe.js`.
- **Scalability:** The background worker and separate websocket server are excellent architectural choices for scalability, but the monolithic Express routes and in-memory JS processing hinder database scalability.

## 11. Feature Gap Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Register / Login / Logout | ✅ Complete | Basic flows function. |
| OTP | ✅ Complete | Nodemailer implemented. |
| Forgot Password | ❌ Missing | No route or UI flow. |
| Refresh Token | ❌ Missing | Relies entirely on 30d JWT. |
| Profile Creation | ✅ Complete | |
| Photo Upload | ⚠ Partial | Saves to local disk, needs cloud storage (S3). |
| Discovery / Distance Filtering | ⚠ Partial | Logic is in JS, not optimized. |
| Swipe / Match | ✅ Complete | Uses ELO rating system. |
| Chat (Socket) | ✅ Complete | Asynchronous persistence working. |
| Notifications | ⚠ Partial | BullMQ queued, but push delivery is mocked. |
| Admin / Moderation | ❌ Missing | No admin panel. |
| Reporting | ❌ Missing | Frontend calls `/report`, backend 404s. |
| Premium (Platinum Hub) | ❌ Missing | Frontend UI exists, no backend logic. |
| Testing / CI/CD | ❌ Missing | |

## 12. Recommended Folder Structure

```text
backend/
├── src/
│   ├── api/
│   │   ├── controllers/      # Handle HTTP req/res
│   │   ├── routes/           # Define endpoints
│   │   └── middlewares/      # Auth, validation, rate limiting
│   ├── core/
│   │   ├── services/         # Business logic (Auth, Profile, Swipe)
│   │   ├── repositories/     # Database access abstraction
│   │   └── utils/            # Distance calculators, hashers
│   ├── config/               # Env vars, DB configs
│   ├── jobs/                 # BullMQ producers
│   └── app.js                # Express setup
```

## 13. Implementation Roadmap

**Phase 1: Architecture Refactoring & Security**
*Why: A solid foundation prevents technical debt from compounding as new features are built.*
- Extract business logic from routes into a Service layer.
- Refactor DB queries into a Repository layer.
- Fix N+1 query issues in matches and block endpoints.
- Secure photo uploads (move to S3 or secure local storage).

**Phase 2: Database & Performance Optimization**
*Why: A dating app must scale its geographic queries rapidly.*
- Implement PostGIS extensions in PostgreSQL.
- Rewrite the `/discover` logic to use native `ST_Distance` queries.
- Implement pagination (cursor-based) for `/discover` and `/messages`.

**Phase 3: Missing Feature Implementation**
*Why: To align the backend strictly with the current frontend expectations.*
- Create `/api/report` and `/api/insights` endpoints.
- Implement 'Forgot Password' and robust Refresh Token flows.
- Integrate a real Push Notification provider (FCM/APNs) in the Worker service.

**Phase 4: Premium & Advanced Features**
*Why: Monetization and advanced user retention.*
- Implement backend logic for the "Platinum Hub" (seeing who liked you).
- Integrate Redis caching for user profiles and discoverability feeds.
- Build Admin and Moderation endpoints.
