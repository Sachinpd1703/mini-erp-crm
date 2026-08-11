import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all user management endpoints (Requires Login & ADMIN Role)
router.use(authenticateJwt);
router.use(authorizeRoles(Role.ADMIN));

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.patch('/:id/role', UserController.updateUserRole);
router.delete('/:id', UserController.deleteUser);

export default router;
