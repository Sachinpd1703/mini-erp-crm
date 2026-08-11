import { Router } from 'express';
import { ProductController } from './product.controller';
import {
  createProductSchema,
  updateProductSchema,
  adjustStockSchema,
} from './product.validation';
import { validateRequest } from '../../middlewares/validation.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateJwt);

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.get('/:id/movements', ProductController.getProductMovements);

router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.WAREHOUSE),
  validateRequest(createProductSchema),
  ProductController.createProduct
);

router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.WAREHOUSE),
  validateRequest(updateProductSchema),
  ProductController.updateProduct
);

router.post(
  '/:id/stock',
  authorizeRoles(Role.ADMIN, Role.WAREHOUSE),
  validateRequest(adjustStockSchema),
  ProductController.adjustStock
);

export default router;
