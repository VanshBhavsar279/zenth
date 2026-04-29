import { Router } from 'express';
import multer from 'multer';
import { uploadHeroImages, uploadImage } from '../controllers/uploadController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/', authMiddleware, upload.single('image'), uploadImage);
router.post('/hero', authMiddleware, upload.array('images', 25), uploadHeroImages);

export default router;
