# Socket Platform Architecture

## Concept
The WebSocket server operates strictly as a Dumb Relay. It does not validate database state. It does not run AI filters.

## Connection Manager
Auth is handled via `jwtService` during the handshake mapping the `socket.id` natively to a `user_uuid` room. This guarantees that emitting to `io.to("user_123")` will successfully hit the user's iPhone, iPad, and Desktop Browser simultaneously without tracking socket arrays manually.

## Scaling
By utilizing the `@socket.io/redis-adapter` natively initialized in `SocketManager.js`, instances of the Spark Node.js backend can autoscale horizontally across AWS Fargate/EC2. The Redis adapter ensures Pub/Sub messages natively cross boundaries.
