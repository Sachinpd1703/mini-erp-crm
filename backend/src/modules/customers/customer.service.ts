import prisma from '../../config/database';
import { CustomerType, CustomerStatus, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../common/errors/app-error';

export class CustomerService {
  static async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: CustomerStatus;
    type?: CustomerType;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.type) {
      where.customerType = params.type;
    }

    if (params.search) {
      const search = params.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          notes: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { fullName: true } } },
          },
          _count: { select: { salesChallans: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      customers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, fullName: true, role: true } },
          },
        },
        salesChallans: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: { select: { id: true, name: true, sku: true, unitPrice: true } },
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundError(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  static async createCustomer(data: {
    name: string;
    mobile: string;
    email: string;
    businessName: string;
    gstNumber?: string | null;
    customerType?: CustomerType;
    address: string;
    status?: CustomerStatus;
    followUpDate?: string | null;
  }) {
    const existingEmail = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new BadRequestError(`Customer with email '${data.email}' already exists`);
    }

    return prisma.customer.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        businessName: data.businessName,
        gstNumber: data.gstNumber || null,
        customerType: data.customerType || CustomerType.RETAIL,
        address: data.address,
        status: data.status || CustomerStatus.LEAD,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      },
    });
  }

  static async updateCustomer(
    id: string,
    data: {
      name?: string;
      mobile?: string;
      email?: string;
      businessName?: string;
      gstNumber?: string | null;
      customerType?: CustomerType;
      address?: string;
      status?: CustomerStatus;
      followUpDate?: string | null;
    }
  ) {
    await this.getCustomerById(id);

    if (data.email) {
      const existing = await prisma.customer.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) {
        throw new BadRequestError(`Email '${data.email}' is already taken by another customer`);
      }
    }

    return prisma.customer.update({
      where: { id },
      data: {
        ...data,
        followUpDate: data.followUpDate !== undefined
          ? (data.followUpDate ? new Date(data.followUpDate) : null)
          : undefined,
      },
    });
  }

  static async addNote(customerId: string, note: string, userId: string) {
    await this.getCustomerById(customerId);

    return prisma.customerNote.create({
      data: {
        customerId,
        createdBy: userId,
        note,
      },
      include: {
        author: { select: { id: true, fullName: true, role: true } },
      },
    });
  }
}
