import request from 'supertest';
import app from '../../src/app.js';

describe('SparkOps Platform API (Boundary)', () => {
  it('should return 401 without token for GET /api/ops/dashboard', async () => {
    const res = await request(app).get('/api/ops/dashboard');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for GET /api/ops/system', async () => {
    const res = await request(app).get('/api/ops/system');
    expect(res.statusCode).toEqual(401);
  });
});
