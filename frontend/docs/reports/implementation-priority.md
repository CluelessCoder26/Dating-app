# Implementation Priority & Risk Matrix

This document ranks the F1-F12 migration phases by Risk, Effort, and Dependencies to determine the optimal implementation priority.

## Priority Ranking Matrix

| Phase | Description | Priority | Risk | Effort | Dependencies |
|-------|-------------|----------|------|--------|--------------|
| **F1** | Design System & Tokens | **High** | Low | Med | None |
| **F2** | State & API Abstraction| **High** | Med | High | None |
| **F3** | Monorepo Transition | **High** | High | High | F2 |
| **F4** | Routing Revamp | **High** | Med | Med | F1, F2 |
| **F5** | Core Components | **Med** | Low | High | F1 |
| **F6** | Auth & Onboarding | **Med** | High | Med | F2, F4, F5 |
| **F7** | Discovery Interface | **Med** | Med | High | F5 |
| **F8** | Real-time Chat | **High** | High | High | F2 |
| **F9** | Profile & Settings | **Low** | Low | Med | F5, F6 |
| **F10** | Performance & Tests | **Med** | Low | High | F1-F9 |
| **F11** | React Native Expo MVP | **Low** | High | High | F1-F9 |
| **F12** | Production / CI/CD | **High** | High | Med | All |

## Risk Analysis

### High Risk Areas
1. **F3 (Monorepo Transition):** Restructuring the repository can cause significant merge conflicts and disrupt parallel development. **Mitigation:** Execute this early and enforce a strict code freeze during the transition.
2. **F6 (Auth) & F8 (Real-time Chat):** Dealing with session tokens and WebSockets is notoriously flaky. **Mitigation:** Ensure thorough unit testing of the `@spark/core` modules before connecting them to the UI.
3. **F11 (React Native MVP):** Unknown native platform limitations might force refactoring of the shared core. **Mitigation:** Do early POCs on mobile during F2 to validate the shared architecture.

### High Effort Areas
- **F2 (State & API):** Rewriting existing tightly-coupled logic into clean, isolated hooks is time-consuming.
- **F5 & F7 (UI Refactoring):** Ensuring pixel-perfect translation to `shadcn/ui` and re-wiring Framer Motion animations across the app.

## Critical Path Dependencies
Phase F1 and F2 are the absolute bottlenecks. No meaningful feature refactoring (F5-F9) can begin until the Design System (F1) and Data Abstraction (F2) are finalized. F3 (Monorepo) should immediately follow F2 to ensure new UI development happens in the correct directory structure.
