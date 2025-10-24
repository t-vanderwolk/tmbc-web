import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.profile.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Allow plain "Karma" for seeded users
    const isSeeded = password === 'Karma' && user.password === 'Karma';
    const valid = isSeeded || (await bcrypt.compare(password, user.password));

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login' });
  }
};

export const me = async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = await prisma.profile.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
    });

    return res.status(201).json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { email } });

    if (!profile) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, profile.password);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: profile.id, role: profile.role as Role });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login' });
  }
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: profile });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve profile' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.json({ message: 'Logged out' });
};
