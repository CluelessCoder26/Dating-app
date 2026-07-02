# Incident Platform Architecture

## Responsibilities
The Incident Platform handles system outages, critical bugs, and security breaches by tracking them through a formal Incident Response lifecycle.

### Lifecycle States
- **OPEN**: Incident declared and initial pager alerts dispatched.
- **INVESTIGATING**: Operations team has acknowledged the incident and is pursuing mitigation.
- **RESOLVED**: Service has been restored, pending formal RCA (Root Cause Analysis).

### Features
- **Assignment**: Tickets can be assigned directly to Site Reliability Engineers or DevOps responders.
- **Timelines**: Deep integration with `OpsAudit` to record exactly when mitigations were deployed.
- **Postmortem**: After resolution, a mandatory postmortem and RCA notes field is attached to the record for historical search.
- **Automated Declarations**: Integration with `MonitoringPlatform` anomalies can automatically open LOW/MEDIUM severity tickets.
