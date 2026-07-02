import request from 'supertest';
import app from '../../src/app.js';

describe('Moderation Admin API (Mocked)', () => {
  it('should return 401 without token for GET /api/moderation/cases', async () => {
    const res = await request(app).get('/api/moderation/cases');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for PATCH /api/moderation/cases/:id', async () => {
    const res = await request(app).patch('/api/moderation/cases/case-123').send({ action: 'BAN' });
    expect(res.statusCode).toEqual(401);
  });
});
