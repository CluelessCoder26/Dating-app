# Operations Platform Architecture

## Responsibilities
The Operations Platform provides the underlying functionality to interact directly with the core Spark platform layers, acting as an abstraction for `SparkOpsGateway`.

### Key Functions
- **User Operations**: Searching users, viewing timelines, suspending, shadow-banning, resetting passwords, forcing logout.
- **Discovery Operations**: Viewing recommendation weights, adjusting algorithms, replaying matches, viewing ranking explanations.
- **Messaging Operations**: Searching conversations, reviewing flagged content, viewing delivery status.
- **Trust Operations**: Interfacing with the Trust & Safety Platform to view moderation queues, process reports, review AI moderation decisions, and apply bulk actions.

### Data Flow
`SparkOpsController` -> `SparkOpsGateway` -> `OperationsPlatform` -> `Domain Services (User/Trust/Discovery/Interaction)` -> `Database`.
