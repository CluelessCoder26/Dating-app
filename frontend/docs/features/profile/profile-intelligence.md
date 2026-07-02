# Profile Intelligence Documentation

## Overview
Profile Intelligence covers the ML-driven aspects of the profile experience, such as smart photo selection, bio suggestions, and profile completion scoring.

## Architecture
- **On-Device ML:** Lightweight models for initial photo quality assessment (blur, lighting).
- **Backend Sync:** Coordination with backend services for deep analysis and recommendations.

## Key Components
- `SmartPhotoSorter`: UI toggle to enable algorithmic ordering of profile pictures based on engagement.
- `BioPromptGenerator`: Contextual suggestions to help users write engaging bios.
- `ProfileStrengthMeter`: Visual indicator and checklist for improving profile visibility.

## API Interfaces
- `GET /api/v1/intelligence/profile-score`
- `POST /api/v1/intelligence/analyze-media`
