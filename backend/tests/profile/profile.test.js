import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';

describe('Profile Endpoints (Mocked)', () => {
  it('should return 401 without token for profile', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for settings', async () => {
    const res = await request(app).get('/api/profile/settings');
    expect(res.statusCode).toEqual(401);
  });

  it('should fail location update without token', async () => {
    const res = await request(app).put('/api/profile/location').send({
      latitude: 40.7128,
      longitude: -74.0060
    });
    expect(res.statusCode).toEqual(401);
  });
});
