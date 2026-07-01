import request from 'supertest';
import app from '../../src/app.js';

describe('Health & Version Endpoints', () => {
  it('should return 200 and version on /version', async () => {
    const res = await request(app).get('/version');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('version');
  });

  it('should return 200 and health status on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('services');
  });

  it('should return 200 on root /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Welcome to Spark Dating API');
  });
});
