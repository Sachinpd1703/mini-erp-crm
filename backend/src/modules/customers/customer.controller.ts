import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';
import { sendSuccess } from '../../common/utils/response';
import { CustomerStatus, CustomerType } from '@prisma/client';

export class CustomerController {
  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, type } = req.query;
      const result = await CustomerService.getCustomers({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        status: status as CustomerStatus,
        type: type as CustomerType,
      });
      return sendSuccess(res, result.customers, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      return sendSuccess(res, customer, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const newCustomer = await CustomerService.createCustomer(req.body);
      return sendSuccess(res, newCustomer, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCustomer = await CustomerService.updateCustomer(req.params.id, req.body);
      return sendSuccess(res, updatedCustomer, 200);
    } catch (error) {
      next(error);
    }
  }

  static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const note = await CustomerService.addNote(req.params.id, req.body.note, userId);
      return sendSuccess(res, note, 201);
    } catch (error) {
      next(error);
    }
  }
}
