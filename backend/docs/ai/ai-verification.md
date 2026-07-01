# AI Verification Architecture

## Goal
Enforce intense media moderation entirely asynchronously to maintain frontend UI snap times and zero uploading lag.

## Queue System
BullMQ establishes a pool. Upon successful Storage insertion, the Primary Photo ID and Base64 buffer drop instantly onto `photoVerificationQueue`. The HTTP controller then detaches and responds 200 OK.

## Execution
`workerManager` spins up 3 concurrent instances of `photoWorker.js`.
1. The Job is ripped from Redis.
2. `ai.service.js` triggers mimicking Deep Learning detections spanning Face counting, Violence detection, NSFW filtering.
3. Verification results and calculated `TrustScores` insert against the 1:1 mapped `PhotoVerification` relation to the photo.
4. Profile Quality algorithms recalculate completion variables dynamically mapping across.
