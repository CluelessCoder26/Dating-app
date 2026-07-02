# Trust UI Documentation

## Overview
The Trust UI encompasses features designed to promote a safe and authentic environment, including user reporting, blocking, and safety center resources.

## Architecture
- **Reporting Flow:** Multi-step wizard to gather context on policy violations.
- **Blocking Mechanism:** Immediate client-side removal of user data, backed by server-side enforcement.

## Key Components
- `ReportDialog`: Modal for submitting detailed reports with optional screenshots.
- `BlockButton`: High-visibility action to prevent further interaction.
- `SafetyCenter`: Hub for educational content and emergency resources.

## API Interfaces
- `POST /api/v1/trust/report`
- `POST /api/v1/trust/block`
- `GET /api/v1/trust/blocked-users`
