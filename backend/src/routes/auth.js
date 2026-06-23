import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

const RegisterSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Invalid phone number format. Must be between 7 and 15 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const LoginSchema = z.object({
  phone: z.string(),
  password: z.string()
});

// User Registration
router.post('/register', async (req, res) => {
  try {
    const validated = RegisterSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: validated.phone }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'A user with this phone number already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        phone: validated.phone,
        passwordHash
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, phone: newUser.phone },
      process.env.JWT_SECRET || 'fallback_secret_key_123',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        phone: newUser.phone
      }
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const validated = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { phone: validated.phone }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(validated.password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'fallback_secret_key_123',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone
      }
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Session Profile Info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: {
          include: {
            photos: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      phone: user.phone,
      profile: user.profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user context' });
  }
});

export default router;
