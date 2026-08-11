import prisma from '../../config/database';
import { MovementType, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError, InsufficientStockError } from '../../common/errors/app-error';

export class ProductService {
  static async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    lowStockOnly?: boolean;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (params.category) {
      where.category = params.category;
    }

    if (params.search) {
      const search = params.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    let products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    let total = await prisma.product.count({ where });

    // Filter for low stock alert dynamically if requested
    if (params.lowStockOnly) {
      products = products.filter((p) => p.currentStock <= p.minStockAlert);
      total = products.length;
    }

    return {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            author: { select: { id: true, fullName: true, role: true } },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return product;
  }

  static async createProduct(data: {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    currentStock?: number;
    minStockAlert?: number;
    location?: string | null;
    imageUrl?: string | null;
  }) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new BadRequestError(`Product with SKU '${data.sku}' already exists`);
    }

    return prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        category: data.category,
        unitPrice: data.unitPrice,
        currentStock: data.currentStock || 0,
        minStockAlert: data.minStockAlert !== undefined ? data.minStockAlert : 5,
        location: data.location || null,
        imageUrl: data.imageUrl || null,
      },
    });
  }

  static async updateProduct(
    id: string,
    data: {
      name?: string;
      sku?: string;
      category?: string;
      unitPrice?: number;
      minStockAlert?: number;
      location?: string | null;
      imageUrl?: string | null;
    }
  ) {
    await this.getProductById(id);

    if (data.sku) {
      const existing = await prisma.product.findFirst({
        where: { sku: data.sku, NOT: { id } },
      });
      if (existing) {
        throw new BadRequestError(`SKU '${data.sku}' is already assigned to another product`);
      }
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async adjustStock(
    id: string,
    quantity: number,
    movementType: MovementType,
    reason: string,
    userId: string
  ) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundError(`Product with ID ${id} not found`);
      }

      let newStock = product.currentStock;

      if (movementType === MovementType.IN) {
        newStock += quantity;
      } else {
        if (product.currentStock < quantity) {
          throw new InsufficientStockError(
            `Insufficient stock for SKU [${product.sku}]. Available: ${product.currentStock}, Requested removal: ${quantity}`
          );
        }
        newStock -= quantity;
      }

      const updatedProduct = await tx.product.update({
        where: { id },
        data: { currentStock: newStock },
      });

      await tx.stockMovement.create({
        data: {
          productId: id,
          quantity,
          movementType,
          reason,
          createdBy: userId,
        },
      });

      return updatedProduct;
    });
  }

  static async getProductMovements(id: string) {
    await this.getProductById(id);

    return prisma.stockMovement.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, fullName: true, role: true } },
      },
    });
  }
}
