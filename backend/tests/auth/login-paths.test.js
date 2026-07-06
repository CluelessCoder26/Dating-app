import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';

const TEST_PASSWORD = 'TestPass123!';

describe('Auth login paths (email + phone)', () => {
  let passwordHash;
  const tag = `auth_paths_${Date.now()}`;
  const emailUser = {
    email: `${tag}_email@test.com`,
    phone: `+1555${String(Math.floor(Math.random() * 1e7)).padStart(7, '0')}`,
  };
  const phoneUser = {
    email: `${tag}_phone@test.com`,
    phone: `+1555${String(Math.floor(Math.random() * 1e7)).padStart(7, '0')}`,
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(TEST_PASSWORD, 4);
    await prisma.user.createMany({
      data: [
        { ...emailUser, passwordHash, emailVerified: true, status: 'active' },
        { ...phoneUser, passwordHash, emailVerified: true, status: 'active' },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [emailUser.email, phoneUser.email] } },
    });
  });

  it('logs in with email identifier', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: emailUser.email, password: TEST_PASSWORD });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('logs in with E.164 phone identifier', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: phoneUser.phone, password: TEST_PASSWORD });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects register when phone format is invalid (before OTP)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        phone: '+1123',
        email: `${tag}_bad@test.com`,
        password: TEST_PASSWORD,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message || res.body.error).toBeTruthy();
  });

  it('register + verify-otp contract unchanged (email OTP)', async () => {
    const regEmail = `${tag}_reg@test.com`;
    const regPhone = `+1555${String(Math.floor(Math.random() * 1e7)).padStart(7, '0')}`;

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ phone: regPhone, email: regEmail, password: TEST_PASSWORD });

    expect(registerRes.statusCode).toBe(201);

    const otpRecord = await prisma.otp.findUnique({
      where: { email_type: { email: regEmail, type: 'verification' } },
    });
    expect(otpRecord).toBeTruthy();
    expect(otpRecord.code).toHaveLength(6);

    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: regEmail, code: otpRecord.code });

    expect(verifyRes.statusCode).toBe(200);
    expect(verifyRes.body).toHaveProperty('token');

    await prisma.user.delete({ where: { email: regEmail } });
  });
});
