import { Router } from 'express';

import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

router.use(authenticate, authorizeRoles('MENTOR'));

router.get('/mentees', async (_req, res) => {
  const mentees = await prisma.profile.findMany({
    where: { role: 'MEMBER' },
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ mentees });
});

export default router;
