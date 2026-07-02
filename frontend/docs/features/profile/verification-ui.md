# Verification UI Documentation

## Overview
The Verification UI guides users through the process of verifying their identity (e.g., photo verification, ID verification) to earn a "Verified" badge.

## Architecture
- **Liveness Detection:** Integration with third-party SDKs or native APIs for real-time selfie capture.
- **Workflow:** Status tracking (Pending, Approved, Rejected) with corresponding UI states.

## Key Components
- `VerificationPrompt`: Banner or modal encouraging unverified users to start the process.
- `SelfieCapture`: Camera interface with guide overlays for required poses.
- `VerificationBadge`: SVG component displayed next to verified user names globally.

## API Interfaces
- `POST /api/v1/verification/start`
- `POST /api/v1/verification/submit`
- `GET /api/v1/verification/status`
