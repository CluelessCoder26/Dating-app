import request from 'supertest';
import app from '../../src/app.js';

describe('Trust & Safety Engine API (Mocked)', () => {
  it('should return 401 without token for POST /api/trust/report', async () => {
    const res = await request(app).post('/api/trust/report').send({
      reportedId: 'user123',
      targetType: 'USER',
      reasonCategory: 'SPAM'
    });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/trust/block', async () => {
    const res = await request(app).post('/api/trust/block').send({ blockedId: 'user123' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for POST /api/trust/mute', async () => {
    const res = await request(app).post('/api/trust/mute').send({ mutedId: 'user123' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for GET /api/trust/reputation', async () => {
    const res = await request(app).get('/api/trust/reputation');
    expect(res.statusCode).toEqual(401);
  });
});
