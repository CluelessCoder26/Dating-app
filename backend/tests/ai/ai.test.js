import request from 'supertest';
import app from '../../src/app.js';

describe('AIOS Platform API (Boundary)', () => {
  it('should return 401 without token for POST /api/ai/profile/review', async () => {
    const res = await request(app).post('/api/ai/profile/review');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/ai/icebreaker', async () => {
    const res = await request(app).post('/api/ai/icebreaker').send({ targetUserId: 'user123' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for GET /api/ai/compatibility/match123', async () => {
    const res = await request(app).get('/api/ai/compatibility/match123');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/ai/reply', async () => {
    const res = await request(app).post('/api/ai/reply').send({ lastMessage: 'hi' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for GET /api/ai/relationship/memory/match123', async () => {
    const res = await request(app).get('/api/ai/relationship/memory/match123');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for GET /api/ai/analytics', async () => {
    const res = await request(app).get('/api/ai/analytics');
    expect(res.statusCode).toEqual(401);
  });
});
