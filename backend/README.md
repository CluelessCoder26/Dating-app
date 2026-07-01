# Spark Backend

## Gap Report (Audit Findings)
- `POST /auth/register`: Returned 400 instead of 409 on duplicate phone; returned extraneous fields rather than just `{ "token": ... }`.
- `POST /auth/login`: Returned extraneous fields rather than just `{ "token": ... }`.
- `GET /auth/me`: Returned `{ id, phone, profile }` instead of exactly `{ profile: ProfileObject }`. Photos were not guaranteed to be ordered by `isPrimary`.
- `POST /profile`: Didn't include photos in the returned profile, and nested the profile inside an object with a message instead of just `{ profile }`.
- `GET /profile/:userId`: Did not check if the target user was blocked or had blocked the requester.
- `GET /profile/discover`: Included an unused PostGIS SQL query. Had photos unsorted.
- `POST /swipe`: Returned extraneous fields rather than just `{ isMatch, match }`.
- `GET /swipe/matches`: Failed to calculate `distanceMiles` and didn't sort photos for the returned profiles.
- `POST /photos/upload`: Returned extraneous fields rather than just `{ photo }`.
- `DELETE /photos/:photoId`: Failed to auto-promote the oldest remaining photo to primary if the primary was deleted.
- `POST /block`, `DELETE /block/:blockedId`: Returned extraneous fields instead of just `{ success: true }`.
- `GET /block`: Returned `profile` objects instead of exactly `{ id, blockedId, blockedPhone }`.
- `websocket/src/index.js`: The `send_msg` event was broadcasting `recv_msg` to the entire room, which included the sender, causing a duplicate echo on the frontend. The `recv_msg` payload was also missing a server-generated `id`.

## Frontend Compatibility Notes
- **Mutual Preference Filtering**: In `/api/profile/discover`, mutual filtering is implemented correctly by ensuring that the candidate's gender satisfies the requester's preference and vice versa.
- **Distance Calculation**: The fallback JavaScript Haversine formula is used as the primary method to calculate distance, as it provides maximum compatibility without relying on PostGIS extensions (especially since SQLite is configured as the Prisma provider).
- **Photo Sorting**: `isPrimary` sorting is manually enforced before sending responses to the frontend since the client relies heavily on `photos[0]` being the main avatar.
- **Messaging IDs**: We manually generate a standard UUID using the Node `crypto` library before persisting to the Database so that real-time socket events can include an ID while asynchronous queuing processes the insert.
