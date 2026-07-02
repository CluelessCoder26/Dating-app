import request from 'supertest';
import app from '../../src/app.js';

describe('Growth & Monetization API (Mocked)', () => {
  it('should return 401 without token for GET /api/growth/plans', async () => {
    const res = await request(app).get('/api/growth/plans');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/growth/subscriptions', async () => {
    const res = await request(app).post('/api/growth/subscriptions').send({ planId: 'plan123' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for GET /api/growth/entitlements', async () => {
    const res = await request(app).get('/api/growth/entitlements');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/growth/promotions/apply', async () => {
    const res = await request(app).post('/api/growth/promotions/apply').send({ code: 'SAVE20' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/growth/rewards/123/redeem', async () => {
    const res = await request(app).post('/api/growth/rewards/123/redeem');
    expect(res.statusCode).toEqual(401);
  });
});
