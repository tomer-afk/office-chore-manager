import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { uploadAny } from '../middleware/upload.js';
import { uploadImage } from '../services/cloudinaryService.js';
import { unlink } from 'fs/promises';

const router = Router();
router.use(authenticateToken, authorize('admin'));

router.post('/image', uploadAny, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { url, publicId } = await uploadImage(req.file.path);
    await unlink(req.file.path).catch(() => {});
    res.json({ url, public_id: publicId });
  } catch (err) {
    if (req.file) await unlink(req.file.path).catch(() => {});
    next(err);
  }
});

export default router;
