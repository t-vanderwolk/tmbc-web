import { Router } from 'express';

import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/invites', async (_req, res) => {
  const invites = await prisma.inviteCode.findMany({
    include: {
      createdBy: {
        select: { id: true, email: true },
      },
    },
  });

  return res.json({ invites });
});

router.post('/invites', async (req, res) => {
  const { code } = req.body as { code?: string };

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!code) {
    return res.status(400).json({ message: 'Invite code required' });
  }

  const invite = await prisma.inviteCode.create({
    data: {
      code,
      createdById: req.user.id,
    },
  });

  return res.status(201).json({ invite });
});

router.patch('/invites/:id', async (req, res) => {
  const { id } = req.params;
  const invite = await prisma.inviteCode.update({
    where: { id },
    data: { used: true },
  });

  return res.json({ invite });
});

export default router;
