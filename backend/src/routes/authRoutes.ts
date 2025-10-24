import { Router } from 'express';
import { login, me } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/me', me);

export default router;
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

export default router;
