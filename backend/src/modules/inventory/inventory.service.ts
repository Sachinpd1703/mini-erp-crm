import prisma from '../../config/database';
import { MovementType, Prisma } from '@prisma/client';

export class InventoryService {
  static async getAllMovements(params: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: MovementType;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 15;
    const skip = (page - 1) * limit;

    const where: Prisma.StockMovementWhereInput = {};

    if (params.productId) {
      where.productId = params.productId;
    }

    if (params.type) {
      where.movementType = params.type;
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, sku: true } },
          author: { select: { id: true, fullName: true, role: true } },
        },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return {
      movements,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getInventoryOverview() {
    const [totalProducts, lowStockCount, outOfStockCount, totalStockUnits] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: { currentStock: { lte: prisma.product.fields.minStockAlert } },
      }),
      prisma.product.count({ where: { currentStock: 0 } }),
      prisma.product.aggregate({
        _sum: { currentStock: true },
      }),
    ]);

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalStockUnits: totalStockUnits._sum.currentStock || 0,
    };
  }
}
