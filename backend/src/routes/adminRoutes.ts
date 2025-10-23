import { Router } from 'express';

import { listUsers, promoteToMentor } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/users', listUsers);
router.post('/promote/:id', promoteToMentor);

export default router;
