import { Router } from 'express';
import { getLessons, getLesson, createLesson, updateLesson, deleteLesson, markAsRead, getUserProgress } from '../controllers/lessons.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticateToken);

router.get('/', getLessons);
router.get('/progress', getUserProgress);
router.get('/:id', getLesson);
router.post('/:id/read', markAsRead);
router.post('/', authorize('admin'), createLesson);
router.put('/:id', authorize('admin'), updateLesson);
router.delete('/:id', authorize('admin'), deleteLesson);

export default router;
