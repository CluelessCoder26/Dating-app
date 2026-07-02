# Trust Platform Architecture

## Centralized Reporting
Instead of disparate report models, the unified `Report` schema handles `targetType` polymorphism natively, storing arrays of `evidenceUrls`.

## Block vs Mute
- **Block**: Destroys mutual interactions, purges Match entries, invalidates Socket connections.
- **Mute**: Soft-filters the UI locally, leaving the target unaware to prevent escalation.

Both feed the `ReputationEngine` asynchronously.
