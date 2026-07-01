import request from 'supertest';
import app from '../../src/app.js';

describe('Discovery Endpoints (Mocked)', () => {
  it('should return 401 without token for getting discovery feed', async () => {
    const res = await request(app).get('/api/discovery');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for getting next discovery feed', async () => {
    const res = await request(app).get('/api/discovery/next');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for getting preferences', async () => {
    const res = await request(app).get('/api/discovery/preferences');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for updating preferences', async () => {
    const res = await request(app).patch('/api/discovery/preferences').send({ minAge: 20 });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for stats tracking', async () => {
    const res = await request(app).post('/api/discovery/stats').send({ action: 'viewed' });
    expect(res.statusCode).toEqual(401);
  });
});
