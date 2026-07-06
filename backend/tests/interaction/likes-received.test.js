import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';
import { jwtService } from '../../src/services/jwt.service.js';
import bcrypt from 'bcryptjs';

const SF = { latitude: 37.7749, longitude: -122.4194 };
let cachedHash;
let userCounter = 0;

async function getPasswordHash() {
  if (!cachedHash) cachedHash = await bcrypt.hash('TestPass123!', 4);
  return cachedHash;
}

async function createUser(suffix, overrides = {}) {
  userCounter += 1;
  const user = await prisma.user.create({
    data: {
      email: `heart_${suffix}_${Date.now()}_${userCounter}@test.com`,
      phone: `+1777${String(Date.now() + userCounter).slice(-10)}`,
      passwordHash: await getPasswordHash(),
      emailVerified: true,
      status: 'active',
      onboardingComplete: true,
    },
  });

  await prisma.profile.create({
    data: {
      userId: user.id,
      name: overrides.name || `User ${suffix}`,
      age: overrides.age ?? 27,
      gender: overrides.gender ?? 'female',
      preference: 'male',
      latitude: SF.latitude,
      longitude: SF.longitude,
      bio: overrides.bio ?? 'Coffee enthusiast',
    },
  });

  await prisma.preference.create({
    data: { userId: user.id, preferredGender: 'male', minAge: 21, maxAge: 40, maxDistance: 50 },
  });
  await prisma.setting.create({ data: { userId: user.id } });

  const token = jwtService.generateAccessToken({ id: user.id, role: 'user' });
  return { user, token };
}

async function cleanup(ids) {
  if (ids.length) await prisma.user.deleteMany({ where: { id: { in: ids } } });
}

describe('Phase 3 — Likes received', () => {
  const ids = [];

  afterAll(async () => {
    await cleanup(ids);
    await prisma.$disconnect();
  }, 30000);

  it('lists users who liked me with pagination shape', async () => {
    const recipient = await createUser('rec', { name: 'Alex', gender: 'male' });
    const liker1 = await createUser('l1', { name: 'Elena' });
    const liker2 = await createUser('l2', { name: 'Sarah' });
    ids.push(recipient.user.id, liker1.user.id, liker2.user.id);

    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${liker1.token}`)
      .send({ targetId: recipient.user.id, action: 'LIKE' });
    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${liker2.token}`)
      .send({ targetId: recipient.user.id, action: 'SUPER_LIKE' });

    const res = await request(app)
      .get('/api/interactions/likes-received')
      .set('Authorization', `Bearer ${recipient.token}`);

    expect(res.status).toBe(200);
    expect(res.body.likes).toHaveLength(2);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.empty).toBe(false);
    expect(res.body.likes[0]).toMatchObject({
      likerId: expect.any(String),
      likedAt: expect.any(String),
      profile: expect.objectContaining({ userId: expect.any(String) }),
    });
    const superLike = res.body.likes.find((l) => l.isSuperLike);
    expect(superLike).toBeDefined();
  }, 60000);

  it('accept creates match, reject dismisses', async () => {
    const recipient = await createUser('rec2', { gender: 'male' });
    const liker = await createUser('liker', { name: 'Maya' });
    ids.push(recipient.user.id, liker.user.id);

    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${liker.token}`)
      .send({ targetId: recipient.user.id, action: 'LIKE' });

    const accept = await request(app)
      .post(`/api/interactions/likes-received/${liker.user.id}/accept`)
      .set('Authorization', `Bearer ${recipient.token}`);
    expect(accept.status).toBe(200);
    expect(accept.body.isMatch).toBe(true);

    const liker2 = await createUser('liker2', { name: 'Nina' });
    ids.push(liker2.user.id);
    await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${liker2.token}`)
      .send({ targetId: recipient.user.id, action: 'LIKE' });

    const reject = await request(app)
      .post(`/api/interactions/likes-received/${liker2.user.id}/reject`)
      .set('Authorization', `Bearer ${recipient.token}`);
    expect(reject.status).toBe(200);

    const list = await request(app)
      .get('/api/interactions/likes-received')
      .set('Authorization', `Bearer ${recipient.token}`);
    expect(list.body.likes.find((l) => l.likerId === liker2.user.id)).toBeUndefined();
  }, 60000);

  it('returns structured empty state', async () => {
    const lonely = await createUser('lonely2', { gender: 'male' });
    ids.push(lonely.user.id);

    const res = await request(app)
      .get('/api/interactions/likes-received')
      .set('Authorization', `Bearer ${lonely.token}`);

    expect(res.status).toBe(200);
    expect(res.body.empty).toBe(true);
    expect(res.body.likes).toEqual([]);
    expect(res.body.message).toBeTruthy();
  }, 30000);
});
