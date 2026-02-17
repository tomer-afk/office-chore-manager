import { Router } from 'express';
import { getDogs, getDog, createDog, updateDog, deleteDog, uploadPhoto } from '../controllers/dogs.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();
router.use(authenticateToken);

router.get('/', getDogs);
router.post('/', createDog);
router.get('/:id', getDog);
router.put('/:id', updateDog);
router.delete('/:id', deleteDog);
router.post('/:id/photo', uploadSingle, uploadPhoto);

export default router;
