import { Request, Response, NextFunction } from 'express';
import { InventoryService } from './inventory.service';
import { sendSuccess } from '../../common/utils/response';
import { MovementType } from '@prisma/client';
import { queryCache } from '../../utils/cache.util';

export class InventoryController {
  static async getAllMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, productId, type } = req.query;
      const cacheKey = `inventory_movements_${page || 1}_${limit || 20}_${productId || ''}_${type || ''}`;

      const cached = queryCache.get(cacheKey);
      if (cached) {
        return sendSuccess(res, (cached as any).data, 200, (cached as any).meta);
      }

      const result = await InventoryService.getAllMovements({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        productId: productId as string,
        type: type as MovementType,
      });

      queryCache.set(cacheKey, { data: result.movements, meta: result.meta }, 30000); // 30 sec cache
      return sendSuccess(res, result.movements, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'inventory_overview';
      const cached = queryCache.get(cacheKey);
      if (cached) {
        return sendSuccess(res, cached, 200);
      }

      const overview = await InventoryService.getInventoryOverview();
      queryCache.set(cacheKey, overview, 30000); // 30 sec cache
      return sendSuccess(res, overview, 200);
    } catch (error) {
      next(error);
    }
  }
}
