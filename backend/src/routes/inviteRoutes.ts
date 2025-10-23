import { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { createInvite, markInviteUsed, validateInvite } from '../controllers/inviteController';

const router = Router();

router.post('/', authMiddleware, requireRole('ADMIN'), createInvite);
router.get('/validate/:code', validateInvite);
router.post('/mark-used', authMiddleware, requireRole('ADMIN'), markInviteUsed);

export default router;
