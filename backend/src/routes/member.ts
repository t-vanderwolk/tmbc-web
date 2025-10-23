import { Router } from 'express';

import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

router.use(authenticate, authorizeRoles('MEMBER'));

router.get('/dashboard', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const profile = await prisma.profile.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, createdAt: true, role: true },
  });

  return res.json({
    profile,
    insights: {
      milestonesCompleted: 0,
      nextAppointment: null,
    },
  });
});

export default router;
