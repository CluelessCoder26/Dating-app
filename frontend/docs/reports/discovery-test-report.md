# Discovery Test Report

## Summary
- **Total Tests**: 145
- **Passed**: 142
- **Failed**: 3
- **Skipped**: 0

## Failing Tests
1. `should trigger match animation on mutual like` (Flaky on CI)
2. `should correctly paginate recommendations` (Mock data issue)
3. `should respect maximum distance filter` (Edge case failure)

## Action Items
- Fix mock data for pagination tests.
- Increase timeout for animation tests on CI.
