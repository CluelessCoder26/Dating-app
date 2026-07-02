# Progressive Web App (PWA) Configuration

## Manifest Overview
The `manifest.json` provides installability:
- **Name**: Dating App
- **Short Name**: DateApp
- **Theme Color**: #FF4B4B
- **Display**: `standalone`

## Service Worker
Our service worker uses Workbox to provide:
- **Offline Fallback**: A custom offline page if the network drops.
- **Static Asset Caching**: Cache-first strategy for app shell assets.
- **API Caching**: Network-first strategy for user profile data, falling back to cached data to ensure fast startup times.
- **Push Notifications**: Handles Web Push notifications for new matches and messages.
