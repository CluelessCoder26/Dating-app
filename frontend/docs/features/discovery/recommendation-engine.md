# Recommendation Engine Frontend Integration

## Overview
Details how the frontend consumes and presents data from the backend recommendation engine.

## API Integration
- Endpoint: `GET /api/v1/recommendations`
- Pagination: Cursor-based pagination to fetch the next batch of profiles before the current deck is empty.
- Error Handling: Fallback UI when recommendations run out or fail to load.
