import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
  getTheme,
  getHeroImages,
  getContact,
  updateTheme,
  updateHeroImages,
  updateContact,
} from '../controllers/settingsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

router.get('/theme', getTheme);
router.get('/hero', getHeroImages);
router.get('/contact', getContact);

router.put(
  '/theme',
  authMiddleware,
  body('primaryColor').optional().isString(),
  body('secondaryColor').optional().isString(),
  body('logoUrl').optional().isString(),
  validate,
  updateTheme
);

router.put(
  '/hero',
  authMiddleware,
  body('heroImagesMobile').optional().isArray(),
  body('heroImagesMobile.*').optional().isString(),
  body('heroImagesDesktop').optional().isArray(),
  body('heroImagesDesktop.*').optional().isString(),
  validate,
  updateHeroImages
);

router.put(
  '/contact',
  authMiddleware,
  body('brandName').optional().isString(),
  body('heroKicker').optional().isString(),
  body('heroHeadline').optional().isString(),
  body('heroTagline').optional().isString(),
  body('footerTagline').optional().isString(),
  body('whatsappNumber').optional().isString(),
  body('phone').optional().isString(),
  body('email').optional().isString(),
  body('address').optional().isString(),
  body('instagramHandle').optional().isString(),
  body('facebookHandle').optional().isString(),
  body('mapEmbedUrl').optional().isString(),
  body('aboutText').optional().isString(),
  validate,
  updateContact
);

export default router;
