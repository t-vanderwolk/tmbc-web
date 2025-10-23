import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import prisma from '../prisma/client';
import type { Role } from '../types/roles';
import { isRole } from '../types/roles';

const router = Router();

type RegisterBody = {
  email: string;
  password: string;
  name?: string;
  inviteCode?: string;
  role?: string;
};

type LoginBody = {
  email: string;
  password: string;
};

const createToken = (id: string, role: Role) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret not configured');
  }

  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  const { email, password, name, role, inviteCode } = req.body as RegisterBody;
  const normalizedRole: Role = isRole(role) ? role : 'MEMBER';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existing = await prisma.profile.findUnique({ where: { email } });

  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  if (normalizedRole !== 'MEMBER') {
    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code required for elevated roles' });
    }

    const invite = await prisma.inviteCode.findUnique({ where: { code: inviteCode } });

    if (!invite || invite.used) {
      return res.status(400).json({ message: 'Invalid invite code' });
    }

    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { used: true },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const profile = await prisma.profile.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: normalizedRole,
    },
  });

  const token = createToken(profile.id, profile.role);

  return res.status(201).json({
    token,
    profile: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password }: LoginBody = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const profile = await prisma.profile.findUnique({ where: { email } });

  if (!profile) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, profile.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createToken(profile.id, profile.role);

  return res.json({
    token,
    profile: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
    },
  });
});

router.post('/logout', (_, res) => {
  return res.json({ message: 'Logged out' });
});

export default router;
