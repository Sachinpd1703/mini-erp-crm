import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authenticateJwt } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/movements', InventoryController.getAllMovements);
router.get('/overview', InventoryController.getInventoryOverview);

export default router;
