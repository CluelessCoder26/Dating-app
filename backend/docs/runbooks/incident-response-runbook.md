# Runbook: Incident Response

## Context
This document outlines the general procedure for handling any critical incident affecting the Spark platform.

## Roles
- **Incident Commander (IC):** Coordinates the response, makes decisions, manages communication.
- **Responder(s):** Engineers actively investigating and mitigating the issue.
- **Communications Lead:** Handles internal and external stakeholder updates.

## Phases

### 1. Detection and Triage
- **Acknowledge:** IC acknowledges the alert.
- **Severity Assessment:** Determine severity (Sev-1: Critical outage, Sev-2: Major feature degraded, Sev-3: Minor issue).
- **Declare Incident:** Open a dedicated war room (e.g., Slack channel, video call).

### 2. Investigation and Mitigation
- **Goal:** Restore service as quickly as possible. Fixing the root cause comes second.
- **Coordinate:** Responders share findings in the war room.
- **Action:** Apply mitigations (e.g., rollback deployment, scale up resources, block bad traffic).

### 3. Resolution
- **Verify:** Confirm the mitigation is effective and metrics return to normal.
- **Monitor:** Observe the system closely for a period to ensure stability.
- **Close Incident:** IC formally closes the active incident phase.

### 4. Post-Incident Review (PIR)
- **Schedule:** Within 48 hours of resolution.
- **Blameless:** Focus on system failures, not human error.
- **Document:** Create a PIR document detailing timeline, root cause, and action items.
- **Action Items:** Assign and track tasks to prevent recurrence (e.g., improve alerts, fix bugs, add runbooks).
