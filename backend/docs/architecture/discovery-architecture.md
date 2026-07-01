# Discovery Architecture

## Overview
The discovery architecture dictates precisely how users retrieve candidate lists, enforcing privacy and relevance synchronously while shifting complex sorting asynchronously or natively into Postgres.

## 1. Request Flow
1. **Controller Layer**: Handles page parsing.
2. **Cache Layer**: Interrogates Redis for existing permutations.
3. **Engine Pipeline**: Constructs the data natively.

## 2. Eligibility & Postgres
Rather than ingesting all Users into memory, `eligibilityEngine.js` acts as an interceptor. It executes a mathematical bounding box mapping directly onto PostgreSQL coordinates, eliminating any user outside `maxDistance` before it even hits the Node Runtime.

## 3. Scale & Sharding
The Discovery architecture isolates itself completely from Mutating tables. The architecture natively supports read-replica DB architectures out of the box because `candidateGenerator` only executes `.findMany()` lookups against the profile tables.
