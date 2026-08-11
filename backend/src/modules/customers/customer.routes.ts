import { Router } from 'express';
import { CustomerController } from './customer.controller';
import {
  createCustomerSchema,
  updateCustomerSchema,
  addCustomerNoteSchema,
} from './customer.validation';
import { validateRequest } from '../../middlewares/validation.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateJwt);

router.get('/', CustomerController.getCustomers);
router.get('/:id', CustomerController.getCustomerById);

router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.SALES),
  validateRequest(createCustomerSchema),
  CustomerController.createCustomer
);

router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.SALES),
  validateRequest(updateCustomerSchema),
  CustomerController.updateCustomer
);

router.post(
  '/:id/notes',
  authorizeRoles(Role.ADMIN, Role.SALES),
  validateRequest(addCustomerNoteSchema),
  CustomerController.addNote
);

export default router;
