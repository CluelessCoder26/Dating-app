# Discovery Platform Documentation

## Overview
The Discovery Platform is the core system responsible for presenting potential matches to users. It integrates with the recommendation engine, filtering system, and real-time sockets to deliver a seamless discovery experience.

## Architecture
- **State Management**: Redux/Zustand for managing discovery queue.
- **Data Fetching**: React Query for caching and background updates.
- **UI Components**: Deck view, individual cards, and interaction overlays.

## Components
- `DiscoveryDeck`
- `DiscoveryCard`
- `MatchOverlay`
