import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';
import { jwtService } from '../../src/services/jwt.service.js';
import bcrypt from 'bcryptjs';

const SF = { latitude: 37.7749, longitude: -122.4194 };
let userCounter = 0;
let cachedPasswordHash;

async function getPasswordHash() {
  if (!cachedPasswordHash) {
    cachedPasswordHash = await bcrypt.hash('TestPass123!', 4);
  }
  return cachedPasswordHash;
}

async function createTestUser(suffix, overrides = {}) {
  const {
    preferredGender = 'male',
    minAge = 21,
    maxAge = 40,
    maxDistance = 50,
    visibility = 'public',
    gender = 'female',
    age = 28,
    latitude = SF.latitude,
    longitude = SF.longitude,
    ...profileFields
  } = overrides;

  userCounter += 1;
  const passwordHash = await getPasswordHash();
  const user = await prisma.user.create({
    data: {
      email: `phase2_${suffix}_${Date.now()}_${userCounter}@test.com`,
      phone: `+1888${String(Date.now() + userCounter).slice(-10)}`,
      passwordHash,
      emailVerified: true,
      status: 'active',
      onboardingComplete: true,
    },
  });

  await prisma.profile.create({
    data: {
      userId: user.id,
      name: `User ${suffix}`,
      age,
      gender,
      preference: preferredGender,
      latitude,
      longitude,
      ...profileFields,
    },
  });

  await prisma.preference.create({
    data: {
      userId: user.id,
      preferredGender,
      minAge,
      maxAge,
      maxDistance,
      visibility,
    },
  });

  await prisma.setting.create({ data: { userId: user.id } });

  const token = jwtService.generateAccessToken({ id: user.id, role: 'user' });
  return { user, token };
}

async function cleanupUsers(ids) {
  if (!ids.length) return;
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
}

describe('Phase 2 — Swipe & Match Engine', () => {
  const userIds = [];

  afterAll(async () => {
    await cleanupUsers(userIds);
    await prisma.$disconnect();
  }, 30000);

  it('persists like and pass swipes', async () => {
    const a = await createTestUser('pa');
    const b = await createTestUser('pb', { gender: 'male' });
    userIds.push(a.user.id, b.user.id);

    const likeRes = await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: b.user.id, action: 'LIKE' });
    expect(likeRes.status).toBe(200);
    expect(likeRes.body.success).toBe(true);

    const swipe = await prisma.swipe.findUnique({
      where: { swiperId_targetId: { swiperId: a.user.id, targetId: b.user.id } },
    });
    expect(swipe?.rating).toBe('LIKE');

    const c = await createTestUser('pc', { gender: 'male' });
    userIds.push(c.user.id);

    const passRes = await request(app)
      .post('/api/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: c.user.id, rating: 'nope' });
    expect(passRes.status).toBe(200);

    const passSwipe = await prisma.swipe.findUnique({
      where: { swiperId_targetId: { swiperId: a.user.id, targetId: c.user.id } },
    });
    expect(passSwipe?.rating).toBe('PASS');
  }, 30000);

  it('blocks self-like', async () => {
    const a = await createTestUser('self');
    userIds.push(a.user.id);

    const res = await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: a.user.id, action: 'LIKE' });

    expect(res.status).toBe(400);
    expect(res.body.error || res.body.message).toMatch(/yourself/i);
  }, 30000);

  it('blocks duplicate swipes', async () => {
    const a = await createTestUser('dupa');
    const b = await createTestUser('dupb', { gender: 'male' });
    userIds.push(a.user.id, b.user.id);

    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: b.user.id, action: 'LIKE' });

    const dup = await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: b.user.id, action: 'LIKE' });

    expect(dup.status).toBe(409);
  }, 30000);

  it('creates match atomically on mutual like (sync)', async () => {
    const a = await createTestUser('ma');
    const b = await createTestUser('mb', { gender: 'male', preferredGender: 'female' });
    userIds.push(a.user.id, b.user.id);

    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: b.user.id, action: 'LIKE' });

    const res = await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${b.token}`)
      .send({ targetId: a.user.id, action: 'LIKE' });

    expect(res.status).toBe(200);
    expect(res.body.isMatch).toBe(true);
    expect(res.body.match?.id).toBeDefined();

    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: a.user.id, user2Id: b.user.id },
          { user1Id: b.user.id, user2Id: a.user.id },
        ],
      },
    });
    expect(match).not.toBeNull();
  }, 30000);

  it('excludes blocked users from matches list', async () => {
    const a = await createTestUser('ba');
    const b = await createTestUser('bb', { gender: 'male', preferredGender: 'female' });
    userIds.push(a.user.id, b.user.id);

    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ targetId: b.user.id, action: 'LIKE' });
    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${b.token}`)
      .send({ targetId: a.user.id, action: 'LIKE' });

    await prisma.block.create({ data: { blockerId: a.user.id, blockedId: b.user.id } });

    const res = await request(app)
      .get('/api/swipe/matches')
      .set('Authorization', `Bearer ${a.token}`);

    expect(res.status).toBe(200);
    const matched = res.body.filter((m) => m?.profile);
    expect(matched.some((m) => m.profile.userId === b.user.id)).toBe(false);
  }, 30000);
});

describe('Phase 2 — Discovery feed', () => {
  const userIds = [];

  afterAll(async () => {
    await cleanupUsers(userIds);
  }, 60000);

  it('respects age, gender, distance, swiped, matched, reported exclusions', async () => {
    const viewer = await createTestUser('disc', {
      gender: 'male',
      preferredGender: 'female',
      minAge: 25,
      maxAge: 30,
      maxDistance: 10,
    });
    userIds.push(viewer.user.id);

    const inRange = await createTestUser('in', {
      gender: 'female',
      age: 27,
      preferredGender: 'male',
      latitude: 37.78,
      longitude: -122.42,
    });
    const tooYoung = await createTestUser('young', {
      gender: 'female',
      age: 22,
      preferredGender: 'male',
    });
    const tooFar = await createTestUser('far', {
      gender: 'female',
      age: 27,
      preferredGender: 'male',
      latitude: 34.05,
      longitude: -118.24,
    });
    const wrongGender = await createTestUser('wg', {
      gender: 'male',
      age: 27,
      preferredGender: 'female',
    });
    userIds.push(inRange.user.id, tooYoung.user.id, tooFar.user.id, wrongGender.user.id);

    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${viewer.token}`)
      .send({ targetId: tooYoung.user.id, action: 'PASS' });

    const res = await request(app)
      .get('/api/discovery')
      .set('Authorization', `Bearer ${viewer.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('profiles');
    expect(res.body).toHaveProperty('empty');
    const ids = res.body.profiles.map((p) => p.userId);
    expect(ids).toContain(inRange.user.id);
    expect(ids).not.toContain(tooYoung.user.id);
    expect(ids).not.toContain(tooFar.user.id);
    expect(ids).not.toContain(wrongGender.user.id);
  }, 60000);

  it('returns structured empty state', async () => {
    const lonely = await createTestUser('lonely', {
      gender: 'male',
      preferredGender: 'female',
      minAge: 60,
      maxAge: 65,
    });
    userIds.push(lonely.user.id);

    const res = await request(app)
      .get('/api/discovery')
      .set('Authorization', `Bearer ${lonely.token}`);

    expect(res.status).toBe(200);
    expect(res.body.empty).toBe(true);
    expect(res.body.profiles).toEqual([]);
    expect(res.body.pagination).toMatchObject({ hasMore: false, count: 0 });
    expect(res.body.message).toBeTruthy();
  }, 30000);

  it('paginates without duplicate profiles across pages', async () => {
    const viewer = await createTestUser('page', {
      gender: 'male',
      preferredGender: 'female',
      minAge: 21,
      maxAge: 45,
      maxDistance: 100,
    });
    userIds.push(viewer.user.id);

    const candidates = [];
    for (let i = 0; i < 25; i++) {
      const c = await createTestUser(`cand${i}`, {
        gender: 'female',
        age: 22 + (i % 10),
        preferredGender: 'male',
        latitude: 37.77 + i * 0.001,
        longitude: -122.41,
      });
      candidates.push(c.user.id);
      userIds.push(c.user.id);
    }

    const page1 = await request(app)
      .get('/api/discovery?page=1')
      .set('Authorization', `Bearer ${viewer.token}`);
    const page2 = await request(app)
      .get('/api/discovery?page=2')
      .set('Authorization', `Bearer ${viewer.token}`);

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);

    const ids1 = page1.body.profiles.map((p) => p.userId);
    const ids2 = page2.body.profiles.map((p) => p.userId);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap).toEqual([]);
  }, 120000);
});
