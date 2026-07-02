# Vercel Deployment Guide

## 1. Overview
The Spark Frontend is optimized for deployment on Vercel, leveraging Edge caching, automated branch previews, and highly optimized static asset delivery.

## 2. Configuration (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 3. Environment Variables
Configure the following in the Vercel Dashboard (Project Settings > Environment Variables):
- `VITE_API_URL`: The production URL of the Phase 12 Backend (e.g., `https://api.spark-dating.com`).
- `VITE_SOCKET_URL`: The websocket endpoint (often identical to API URL).
- `VITE_ENVIRONMENT`: `production`.

## 4. Build Optimization (Vite)
- **Code Splitting**: Rollup is configured to split vendor chunks (React, Framer Motion) from application code to ensure efficient cache hits.
- **Lazy Loading**: Route-level code splitting using `React.lazy()` ensures the initial JavaScript payload remains under 150KB (gzipped).

## 5. PWA (Progressive Web App)
- Integrate `vite-plugin-pwa` to generate a Service Worker and `manifest.json`.
- Enables "Add to Home Screen" functionality on iOS/Android, providing a near-native full-screen experience before the React Native app is released.
