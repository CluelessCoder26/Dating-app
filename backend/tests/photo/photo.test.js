import request from 'supertest';
import app from '../../src/app.js';
import path from 'path';

describe('Photo Endpoints (Mocked)', () => {
  it('should return 401 without token for getting photos', async () => {
    const res = await request(app).get('/api/photos');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for upload', async () => {
    const res = await request(app).post('/api/photos/upload');
    expect(res.statusCode).toEqual(401);
  });

  it('should fail with 401 on missing token for primary update', async () => {
    const res = await request(app).patch('/api/photos/primary').send({ photoId: '123' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for getting trust score', async () => {
    const res = await request(app).get('/api/photos/trust-score');
    expect(res.statusCode).toEqual(401);
  });

  // Since we require valid JWTs to test further, 
  // these boundary tests confirm the API endpoints correctly exist and are protected.
});
