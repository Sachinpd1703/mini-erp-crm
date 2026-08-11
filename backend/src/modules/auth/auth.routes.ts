import { Router } from 'express';
import { AuthController } from './auth.controller';
import { loginSchema } from './auth.validation';
import { validateRequest } from '../../middlewares/validation.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', authenticateJwt, AuthController.getProfile);

export default router;
