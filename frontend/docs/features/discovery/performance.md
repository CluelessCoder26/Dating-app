# Discovery Performance Optimization

## Overview
Strategies to ensure the discovery deck remains fluid and responsive.

## Techniques
- **Image Preloading**: Preload images for the next 3-5 cards in the queue.
- **DOM Node Limit**: Render only the top 3 cards in the DOM to prevent jank.
- **Memoization**: Heavy use of `React.memo` on the `DiscoveryCard` component.
