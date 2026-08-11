import { Request, Response, NextFunction } from 'express';
import { ChallanService } from './challan.service';
import { PdfService } from './pdf.service';
import { sendSuccess } from '../../common/utils/response';
import { ChallanStatus } from '@prisma/client';

export class ChallanController {
  static async getChallans(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, customerId } = req.query;
      const result = await ChallanService.getChallans({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        status: status as ChallanStatus,
        customerId: customerId as string,
      });
      return sendSuccess(res, result.challans, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getChallanById(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.getChallanById(req.params.id);
      return sendSuccess(res, challan, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createChallan(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { customerId, items, status } = req.body;
      const newChallan = await ChallanService.createChallan(
        customerId,
        items,
        status,
        userId
      );
      return sendSuccess(res, newChallan, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateChallanStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { status } = req.body;
      const updatedChallan = await ChallanService.updateChallanStatus(
        req.params.id,
        status,
        userId
      );
      return sendSuccess(res, updatedChallan, 200);
    } catch (error) {
      next(error);
    }
  }

  static async generatePdfInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.getChallanById(req.params.id);
      const pdfDoc = PdfService.generateChallanPdf(challan);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=Invoice_${challan.challanNumber}.pdf`
      );

      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      next(error);
    }
  }
}
