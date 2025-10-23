import { Request, Response } from 'express';
import crypto from 'node:crypto';

import prisma from '../prisma/client';

const generateCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export const createInvite = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const code = generateCode();

    const invite = await prisma.inviteCode.create({
      data: {
        code,
        createdById: req.user.id,
      },
    });

    return res.status(201).json({ invite });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create invite' });
  }
};

export const validateInvite = async (req: Request, res: Response) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: 'Invite code is required' });
  }

  try {
    const invite = await prisma.inviteCode.findUnique({ where: { code } });

    if (!invite || invite.used) {
      return res.status(404).json({ valid: false });
    }

    return res.json({ valid: true, invite });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to validate invite' });
  }
};

export const markInviteUsed = async (req: Request, res: Response) => {
  const { code } = req.body as { code?: string };

  if (!code) {
    return res.status(400).json({ message: 'Invite code is required' });
  }

  try {
    const invite = await prisma.inviteCode.findUnique({ where: { code } });

    if (!invite || invite.used) {
      return res.status(404).json({ message: 'Invite not available' });
    }

    const updated = await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { used: true },
    });

    return res.json({ invite: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update invite' });
  }
};
