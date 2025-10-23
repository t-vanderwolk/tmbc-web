import { Request, Response } from 'express';

import prisma from '../prisma/client';

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.profile.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch users' });
  }
};

export const promoteToMentor = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User id is required' });
  }

  try {
    const updated = await prisma.profile.update({
      where: { id },
      data: { role: 'MENTOR' },
      select: { id: true, email: true, name: true, role: true },
    });

    return res.json({ user: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to promote user' });
  }
};
