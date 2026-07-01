import request from 'supertest';
import app from '../../src/app.js';

describe('Real-Time REST Endpoints (Mocked)', () => {
  it('should return 401 without token for getting conversations', async () => {
    const res = await request(app).get('/api/conversations');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for sending message', async () => {
    const res = await request(app).post('/api/messages').send({ conversationId: '123', content: 'hello' });
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 without token for marking read', async () => {
    const res = await request(app).patch('/api/messages/read').send({ messageIds: ['123'] });
    expect(res.statusCode).toEqual(401);
  });
});
