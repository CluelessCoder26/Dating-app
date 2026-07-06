import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';
import { jwtService } from '../../src/services/jwt.service.js';

describe('End-to-End User Journey', () => {
  let user1Token;
  let user2Token;
  let user1Id;
  let user2Id;

  beforeAll(async () => {
    // 1. Create Mock Users
    const user1 = await prisma.user.create({
      data: {
        email: `e2e_user1_${Date.now()}@test.com`,
        phone: `+1555${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        passwordHash: 'hashed_password',
        status: 'active'
      }
    });
    user1Id = user1.id;
    user1Token = jwtService.generateAccessToken({ id: user1.id, role: 'USER' });

    const user2 = await prisma.user.create({
      data: {
        email: `e2e_user2_${Date.now()}@test.com`,
        phone: `+1555${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        passwordHash: 'hashed_password',
        status: 'active'
      }
    });
    user2Id = user2.id;
    user2Token = jwtService.generateAccessToken({ id: user2.id, role: 'USER' });

    // 2. Create Profiles
    await prisma.profile.create({
      data: {
        userId: user1Id,
        name: 'Alex',
        bio: 'Tech enthusiast',
        interests: ['coding', 'coffee'],
        gender: 'MALE',
        latitude: 0,
        longitude: 0,
        age: 31,
        preference: 'FEMALE'
      }
    });

    await prisma.profile.create({
      data: {
        userId: user2Id,
        name: 'Sam',
        bio: 'Coffee lover',
        interests: ['coffee', 'reading'],
        gender: 'FEMALE',
        latitude: 0,
        longitude: 0,
        age: 30,
        preference: 'MALE'
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { id: { in: [user1Id, user2Id] } }
    });
  });

  it('Step 1: User 1 fetches discovery feed', async () => {
    const res = await request(app)
      .get('/api/discovery')
      .set('Authorization', `Bearer ${user1Token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('profiles');
    expect(res.body).toHaveProperty('empty');
  });

  it('Step 2: User 1 swipes right on User 2', async () => {
    const res = await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ targetId: user2Id, action: 'LIKE' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('Step 3: User 2 swipes right on User 1 (Creates Match)', async () => {
    const res = await request(app)
      .post('/api/interactions/swipe')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ targetId: user1Id, action: 'LIKE' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('isMatch', true);
  });

  it('Step 4: User 1 gets AI Compatibility', async () => {
    const match = await prisma.match.findFirst({
      where: { 
        OR: [
          { user1Id: user1Id, user2Id: user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      }
    });
    
    expect(match).not.toBeNull();
    
    // We expect 401 if missing auth, but with auth we expect 200
    const res = await request(app)
      .get(`/api/ai/compatibility/${match.id}`)
      .set('Authorization', `Bearer ${user1Token}`);
      
    expect(res.statusCode).toBe(200);
  });
});
