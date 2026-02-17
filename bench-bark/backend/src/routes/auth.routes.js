import { Router } from 'express';
import { register, login, googleAuth, logout, getCurrentUser, refreshAccessToken } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
