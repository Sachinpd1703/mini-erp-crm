import prisma from '../../config/database';
import { ChallanStatus, MovementType, CustomerStatus, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError, InsufficientStockError } from '../../common/errors/app-error';

export class ChallanService {
  private static async generateChallanNumber(): Promise<string> {
    const date = new Date();
    const prefix = `CH-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const count = await prisma.salesChallan.count({
      where: { challanNumber: { startsWith: prefix } },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${sequence}`;
  }

  static async getChallans(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ChallanStatus;
    customerId?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SalesChallanWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.customerId) {
      where.customerId = params.customerId;
    }

    if (params.search) {
      const search = params.search.trim();
      where.OR = [
        { challanNumber: { contains: search, mode: 'insensitive' } },
        { customer: { businessName: { contains: search, mode: 'insensitive' } } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [challans, total] = await Promise.all([
      prisma.salesChallan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, businessName: true, email: true } },
          author: { select: { id: true, fullName: true, role: true } },
          _count: { select: { items: true } },
        },
      }),
      prisma.salesChallan.count({ where }),
    ]);

    return {
      challans,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getChallanById(id: string) {
    const challan = await prisma.salesChallan.findUnique({
      where: { id },
      include: {
        customer: true,
        author: { select: { id: true, fullName: true, role: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true, currentStock: true } },
          },
        },
      },
    });

    if (!challan) {
      throw new NotFoundError(`Sales Challan with ID ${id} not found`);
    }

    return challan;
  }

  static async createChallan(
    customerId: string,
    items: { productId: string; quantity: number }[],
    requestedStatus: ChallanStatus = ChallanStatus.DRAFT,
    userId: string
  ) {
    // 1. Verify Customer exists
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundError(`Customer with ID ${customerId} not found`);
    }

    // 2. Process inside Isolated Transaction
    return prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundError('One or more requested products do not exist');
      }

      const productMap = new Map(products.map((p) => [p.id, p]));
      let totalAmount = 0;
      let totalQuantity = 0;

      const challanItemCreateInputs: any[] = [];

      for (const item of items) {
        const product = productMap.get(item.productId)!;

        // Check stock availability if creating directly as CONFIRMED
        if (requestedStatus === ChallanStatus.CONFIRMED && product.currentStock < item.quantity) {
          throw new InsufficientStockError(
            `Insufficient stock for item [${product.name} - SKU: ${product.sku}]. Available: ${product.currentStock}, Requested: ${item.quantity}`
          );
        }

        const unitPriceNum = Number(product.unitPrice);
        const lineTotalNum = unitPriceNum * item.quantity;

        totalAmount += lineTotalNum;
        totalQuantity += item.quantity;

        challanItemCreateInputs.push({
          productId: product.id,
          snapshotProductName: product.name,
          snapshotSku: product.sku,
          snapshotUnitPrice: product.unitPrice,
          quantity: item.quantity,
          lineTotal: lineTotalNum,
        });
      }

      const challanNumber = await this.generateChallanNumber();

      const newChallan = await tx.salesChallan.create({
        data: {
          challanNumber,
          customerId,
          status: requestedStatus,
          totalAmount,
          totalQuantity,
          createdBy: userId,
          items: {
            create: challanItemCreateInputs,
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      // Execute stock deduction if confirmed immediately
      if (requestedStatus === ChallanStatus.CONFIRMED) {
        for (const item of items) {
          const product = productMap.get(item.productId)!;
          await tx.product.update({
            where: { id: product.id },
            data: { currentStock: { decrement: item.quantity } },
          });

          await tx.stockMovement.create({
            data: {
              productId: product.id,
              quantity: item.quantity,
              movementType: MovementType.OUT,
              reason: `Sales Order Fulfillment (Challan #${challanNumber})`,
              createdBy: userId,
            },
          });
        }

        // Auto-activate lead customer on confirmed order
        if (customer.status === CustomerStatus.LEAD) {
          await tx.customer.update({
            where: { id: customerId },
            data: { status: CustomerStatus.ACTIVE },
          });
        }
      }

      return newChallan;
    });
  }

  static async updateChallanStatus(
    id: string,
    targetStatus: 'CONFIRMED' | 'CANCELLED',
    userId: string
  ) {
    const existingChallan = await prisma.salesChallan.findUnique({
      where: { id },
      include: { items: true, customer: true },
    });

    if (!existingChallan) {
      throw new NotFoundError(`Sales Challan with ID ${id} not found`);
    }

    if (existingChallan.status !== ChallanStatus.DRAFT) {
      throw new BadRequestError(
        `Challan #${existingChallan.challanNumber} is already in state '${existingChallan.status}' and cannot be modified.`
      );
    }

    return prisma.$transaction(async (tx) => {
      if (targetStatus === ChallanStatus.CONFIRMED) {
        // Atomic stock verification
        for (const item of existingChallan.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new NotFoundError(`Product for item ${item.snapshotProductName} no longer exists`);
          }

          if (product.currentStock < item.quantity) {
            throw new InsufficientStockError(
              `Cannot confirm order. Stock for item [${product.name} - SKU: ${product.sku}] is insufficient. Available: ${product.currentStock}, Required: ${item.quantity}`
            );
          }

          // Deduct stock
          await tx.product.update({
            where: { id: product.id },
            data: { currentStock: { decrement: item.quantity } },
          });

          // Log stock movement audit
          await tx.stockMovement.create({
            data: {
              productId: product.id,
              quantity: item.quantity,
              movementType: MovementType.OUT,
              reason: `Sales Order Fulfillment (Challan #${existingChallan.challanNumber})`,
              createdBy: userId,
            },
          });
        }

        // Auto-activate lead customer
        if (existingChallan.customer.status === CustomerStatus.LEAD) {
          await tx.customer.update({
            where: { id: existingChallan.customerId },
            data: { status: CustomerStatus.ACTIVE },
          });
        }
      }

      const updatedChallan = await tx.salesChallan.update({
        where: { id },
        data: { status: targetStatus },
        include: {
          customer: true,
          items: true,
        },
      });

      return updatedChallan;
    });
  }
}
