# ADR 003: BullMQ for Job Queues

## Context
The backend needs to perform heavy, long-running, or recurring tasks (e.g., sending emails, processing images, AI matching algorithms) without blocking the main API threads.

## Problem
Handling these tasks synchronously degrades user experience and can lead to timeouts. We need a robust queueing system to manage background jobs.

## Decision
We will use BullMQ (backed by Redis) for our job and task queues.

## Alternatives Considered
- Agenda (MongoDB backed): Good if we were fully invested in MongoDB, but Redis is faster for queue operations.
- RabbitMQ/Celery: Powerful, but adds another infrastructure dependency.
- AWS SQS: Good, but ties us to AWS. BullMQ keeps us cloud-agnostic and reuses our Redis infrastructure.

## Consequences
- **Positive:** Reliable background processing, easy integration with Node.js/TypeScript, utilizes existing Redis infrastructure, supports retries, delayed jobs, and cron-like scheduling.
- **Negative:** Relies heavily on Redis; if Redis goes down, background processing stops.

## Future Considerations
- Implement robust monitoring for queue lengths and processing times.
- Scale out worker nodes independently of the main API servers.
