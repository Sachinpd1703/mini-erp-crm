import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { sendSuccess } from '../../common/utils/response';
import { queryCache } from '../../utils/cache.util';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, category, lowStockOnly } = req.query;
      const cacheKey = `products_${page || 1}_${limit || 20}_${search || ''}_${category || ''}_${lowStockOnly || ''}`;

      const cached = queryCache.get(cacheKey);
      if (cached) {
        return sendSuccess(res, (cached as any).data, 200, (cached as any).meta);
      }

      const result = await ProductService.getProducts({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        category: category as string,
        lowStockOnly: lowStockOnly === 'true',
      });

      queryCache.set(cacheKey, { data: result.products, meta: result.meta }, 30000);
      return sendSuccess(res, result.products, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return sendSuccess(res, product, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      queryCache.invalidatePattern('products_');
      queryCache.invalidatePattern('inventory_');
      return sendSuccess(res, newProduct, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
      queryCache.invalidatePattern('products_');
      queryCache.invalidatePattern('inventory_');
      return sendSuccess(res, updatedProduct, 200);
    } catch (error) {
      next(error);
    }
  }

  static async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { quantity, movementType, reason } = req.body;
      const result = await ProductService.adjustStock(
        req.params.id,
        quantity,
        movementType,
        reason,
        userId
      );
      queryCache.invalidatePattern('products_');
      queryCache.invalidatePattern('inventory_');
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getProductMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const movements = await ProductService.getProductMovements(req.params.id);
      return sendSuccess(res, movements, 200);
    } catch (error) {
      next(error);
    }
  }
}
