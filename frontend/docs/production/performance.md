# Performance Optimization Guidelines

## Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Strategies Implemented
1. **Code Splitting**: Using dynamic imports for route-level components to reduce initial bundle size.
2. **Asset Optimization**:
   - All images are served in WebP/AVIF formats.
   - SVG icons are sprite-mapped.
3. **Caching Strategy**:
   - Static assets (JS, CSS, images) are aggressively cached at the edge (CDN) with `Cache-Control: public, max-age=31536000, immutable`.
   - API requests for static configuration are cached via service worker.
4. **Pre-fetching**: Key user journeys (e.g., swiping, messaging) prefetch necessary chunks upon hover.
