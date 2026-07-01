# Manual Test Checklist (RC1)

## Environment
Ensure `docker compose up -d` has successfully launched Postgres and Redis. Boot local server using `npm run dev`.

## Steps
- [ ] **Health & Tools**:
  - Visit `http://localhost:5000/health`. Verify all sub-services state "up".
  - Visit `http://localhost:5000/docs` to verify Swagger UI renders successfully.
  - Visit `http://localhost:5000/redoc` to verify ReDoc renders successfully.

- [ ] **Registration**:
  - Call `POST /api/auth/register` with valid phone/email/password. Verify 201 response.
  - Attempt duplicate registration. Verify 409 Conflict.
  - Inspect terminal to acquire generated OTP code.

- [ ] **Verification**:
  - Call `POST /api/auth/verify-otp` with captured code. Verify access token generation.

- [ ] **Login & Logout**:
  - Call `POST /api/auth/login`. Extract refresh token from headers/cookies.
  - Call `POST /api/auth/refresh`. Verify old token invalidation and new token issuance.
  - Call `POST /api/auth/logout`. Verify single session destroyed.
  - Call `POST /api/auth/logout-all`. Verify all sessions globally terminated.

- [ ] **Security Triggers**:
  - Deliberately fail login 5 times. Verify 15-minute account lockout logic returns `403/401`.

- [ ] **Socket Stability**:
  - Connect client with JWT Bearer. Verify `user_{id}` room membership logs in server console.

- [ ] **Profile Onboarding & Mgmt**:
  - `GET /api/profile/onboarding`. Confirm `onboardingComplete` is false.
  - `POST /api/profile` to create. Verify DB includes default preferences.
  - `PUT /api/profile` with `age: 25`. Verify 200 response and `completionScore` update.
  - `PUT /api/profile/location` with Lat/Lon. Verify update.
  - `PUT /api/profile/preferences` to edit maxDistance.
  - `PUT /api/profile/settings` to disable online status.
  - `POST /api/profile/deactivate` and `DELETE /api/profile` to soft delete account.

- [ ] **Media & AI Verification**:
  - `POST /api/photos/upload` with a multipart image. Verify response returns `url`.
  - Check `BullMQ` or console logs to ensure `photoVerificationQueue` processed the AI check.
  - `GET /api/photos/trust-score`. Verify trust score generated.
  - `GET /api/photos`. Confirm `isPrimary` status is accurately reflected.
  - Trigger duplicate upload with identical image (hashes should match) and observe rejected AI verification state.

- [ ] **Discovery & Candidate Generation**:
  - `GET /api/discovery`. Verify array of users is returned sorted by `recommendationScore`.
  - Check Redis using `redis-cli keys *discovery*` to verify cache is active.
  - `PATCH /api/discovery/preferences` with `maxDistance: 10`. Verify response.
  - Check Redis again to ensure the discovery cache was nuked.
  - `GET /api/discovery`. Verify newly filtered users are within bounds.
  - `POST /api/discovery/stats` with `action: 'viewed'`. Verify DB record in `DiscoveryMetric`.

- [ ] **Interaction & Match Engine**:
  - `POST /api/interactions/swipe` with action `LIKE`.
  - Simulate reverse `LIKE` from target. Check BullMQ processing.
  - Confirm `GET /api/interactions/matches` shows the new match with populated metadata.
  - Check Redis / Postgres that `Relationship` node upgraded to `MATCHED`.
  - Verify Socket.IO clients received `match.created` event payload.
  - Verify duplicate swipe is rejected by `NotAlreadySwipedRule`.
  - `DELETE /api/interactions/matches/:id`. Confirm match disappears and Relationship resets.

- [ ] **Real-Time Relationship Platform**:
  - Connect WebSocket with valid JWT. Verify `presence.update` emits `online`.
  - Verify Redis `presence:{userId}` reflects online state.
  - `POST /api/messages` to send a text message. Verify temporary ID returns 200 OK immediately.
  - Verify `messagePersistenceQueue` saves the message to PostgreSQL.
  - Verify `deliveryQueue` emits `message.delivered` to the target socket if online.
  - If offline, verify `notificationQueue` catches the event.
  - Verify `typing.start` and `typing.stop` propagate across active sockets.
  - Disconnect WebSocket. Verify `presence.update` emits `offline`.
