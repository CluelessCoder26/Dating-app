import request from 'supertest';
import app from '../../src/app.js';

describe('Interaction Endpoints (Mocked)', () => {
  it('should return 401 without token for swiping', async () => {
    const res = await request(app).post('/api/interactions/swipe').send({ targetId: '123', action: 'LIKE' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for history', async () => {
    const res = await request(app).get('/api/interactions/history');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for stats', async () => {
    const res = await request(app).get('/api/interactions/stats');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for getting matches', async () => {
    const res = await request(app).get('/api/interactions/matches');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for deleting match', async () => {
    const res = await request(app).delete('/api/interactions/matches/123');
    expect(res.statusCode).toEqual(401);
  });
});
