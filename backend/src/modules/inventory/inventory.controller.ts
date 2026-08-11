import { Request, Response, NextFunction } from 'express';
import { InventoryService } from './inventory.service';
import { sendSuccess } from '../../common/utils/response';
import { MovementType } from '@prisma/client';

export class InventoryController {
  static async getAllMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, productId, type } = req.query;
      const result = await InventoryService.getAllMovements({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        productId: productId as string,
        type: type as MovementType,
      });
      return sendSuccess(res, result.movements, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await InventoryService.getInventoryOverview();
      return sendSuccess(res, overview, 200);
    } catch (error) {
      next(error);
    }
  }
}
