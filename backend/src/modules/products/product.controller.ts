import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { sendSuccess } from '../../common/utils/response';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, category, lowStockOnly } = req.query;
      const result = await ProductService.getProducts({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        category: category as string,
        lowStockOnly: lowStockOnly === 'true',
      });
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
      return sendSuccess(res, newProduct, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
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
