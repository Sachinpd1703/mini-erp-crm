import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all user management endpoints (Requires Login & ADMIN Role)
router.use(authenticate);
router.use(authorize([Role.ADMIN]));

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.patch('/:id/role', UserController.updateUserRole);
router.delete('/:id', UserController.deleteUser);

export default router;
