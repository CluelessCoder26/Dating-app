# Database seed (development only)

Run from `backend/`:

```bash
node prisma/seed.js
# or, after adding prisma seed config:
npx prisma db seed
```

## Idempotency

All seed users are tagged via email domain `@spark-dev.seed` and phone prefix `+199990`. Re-running the script **removes prior seed data** with that tag, then recreates it. Non-seed rows are untouched.

## Demo account

| Field | Value |
|---|---|
| Email | `demo@spark-dev.seed` |
| Phone | `+199990000001` |
| Password | `SeedPass123!` |

## Placeholder images (dev-only)

Seed photos use [picsum.photos](https://picsum.photos) URLs (`https://picsum.photos/seed/spark-dev-…`). These are **development fixtures only** — never wire this URL pattern into production upload or serving code paths.

## Coverage

~60 users spanning genders, ages, cities, completion levels, verified/unverified, free/premium, photo counts, one-way likes, matches, chats, blocks, reports, activity tiers, geo buckets, and visibility/incognito settings.
