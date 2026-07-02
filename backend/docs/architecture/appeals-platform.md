# Appeals Platform Architecture

## Process
Users interact with the `/api/trust/appeal` endpoint passing a `restrictionId` and reasoning.

## Overrides
When an Admin resolves the appeal with `APPROVED`, the engine locates the `Restriction` row and sets `active: false`, instantly broadcasting `RESTRICTION_REMOVED` via EventBus and WebSockets.
