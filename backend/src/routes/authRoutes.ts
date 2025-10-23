import { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { login, logout, me, register } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

export default router;
