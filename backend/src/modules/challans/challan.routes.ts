import { Router } from 'express';
import { ChallanController } from './challan.controller';
import {
  createChallanSchema,
  updateChallanStatusSchema,
} from './challan.validation';
import { validateRequest } from '../../middlewares/validation.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateJwt);

router.get('/', ChallanController.getChallans);
router.get('/:id', ChallanController.getChallanById);
router.get('/:id/pdf', ChallanController.generatePdfInvoice);

router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.SALES),
  validateRequest(createChallanSchema),
  ChallanController.createChallan
);

router.patch(
  '/:id/status',
  authorizeRoles(Role.ADMIN, Role.SALES),
  validateRequest(updateChallanStatusSchema),
  ChallanController.updateChallanStatus
);

export default router;
