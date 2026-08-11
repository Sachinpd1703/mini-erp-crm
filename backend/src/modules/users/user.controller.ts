import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, role } = req.query;
      const users = await UserService.getUsers({
        search: search as string,
        role: role as any,
      });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const updatedUser = await UserService.updateUserRole(id, role);

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const requestingUserId = (req as any).user.id;
      const result = await UserService.deleteUser(id, requestingUserId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
