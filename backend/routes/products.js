import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getProducts,
  getProductById,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  patchStock,
  toggleVisibility,
  toggleFeatured,
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

/** Public list */
router.get('/', getProducts);

/** Admin list — must be before /:id */
router.get('/admin/all', authMiddleware, getProductsAdmin);

router.get(
  '/:id',
  optionalAuthMiddleware,
  param('id').isMongoId(),
  validate,
  getProductById
);

/** Admin */
router.post(
  '/',
  authMiddleware,
  body('name').trim().notEmpty(),
  body('category').isIn(['Polo', 'Printed', 'Coloured']),
  body('price').isFloat({ min: 0 }),
  validate,
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  param('id').isMongoId(),
  validate,
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  param('id').isMongoId(),
  validate,
  deleteProduct
);

router.patch(
  '/:id/stock',
  authMiddleware,
  param('id').isMongoId(),
  body('colorId').isString().trim().notEmpty(),
  body('stock').isInt({ min: 0 }),
  validate,
  patchStock
);

router.patch(
  '/:id/visibility',
  authMiddleware,
  param('id').isMongoId(),
  validate,
  toggleVisibility
);

router.patch(
  '/:id/featured',
  authMiddleware,
  param('id').isMongoId(),
  validate,
  toggleFeatured
);

export default router;
