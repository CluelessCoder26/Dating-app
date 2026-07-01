# Delivery Engine Architecture

## Asynchronous Disconnect
Instead of binding POST requests to Database IO limits, the `DeliveryEngine` intercepts `/api/messages`.

1. Generates `UUIDv4`.
2. Handoffs to BullMQ.
3. Returns `200 OK`.

## BullMQ Execution
1. **PersistenceWorker**: Runs the heavy Prisma `.create()` call entirely off-thread.
2. **DeliveryWorker**: Interrogates the `PresenceEngine` natively and executes `io.to().emit()` securely. If offline, the payload drops into the `notificationQueue` natively triggering Apple APNS / Google FCM payloads.
