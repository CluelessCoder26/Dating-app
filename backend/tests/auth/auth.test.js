import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';

describe('Auth Endpoints (Mocked)', () => {
  it('should fail on /api/auth/register without payload', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toEqual(400); // Validation error
  });

  it('should fail on /api/auth/login without payload', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toEqual(400); // Validation error
  });

  it('should return 401 on /api/auth/me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });
});
