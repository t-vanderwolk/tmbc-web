import { Request, Response } from 'express';

import prisma from '../prisma/client';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { generateToken } from '../utils/generateToken';

type Role = 'ADMIN' | 'MENTOR' | 'MEMBER';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role = 'MEMBER', inviteCode } = req.body as {
    email?: string;
    password?: string;
    name?: string;
    role?: Role;
    inviteCode?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!['ADMIN', 'MENTOR', 'MEMBER'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role supplied' });
  }

  try {
    const existing = await prisma.profile.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    let finalRole: Role = role;

    if (role !== 'MEMBER') {
      if (!inviteCode) {
        return res.status(400).json({ message: 'Invite code required for elevated roles' });
      }

      const invite = await prisma.inviteCode.findUnique({ where: { code: inviteCode } });

      if (!invite || invite.used) {
        return res.status(400).json({ message: 'Invalid or already used invite code' });
      }

      await prisma.inviteCode.update({
        where: { id: invite.id },
        data: { used: true },
      });
    } else {
      finalRole = 'MEMBER';
    }

    const hashed = await hashPassword(password);

    const profile = await prisma.profile.create({
      data: {
        email,
        password: hashed,
        name,
        role: finalRole,
      },
    });

    const token = generateToken({ id: profile.id, role: profile.role });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
