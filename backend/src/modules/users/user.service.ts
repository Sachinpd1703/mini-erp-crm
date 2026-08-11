import prisma from '../../config/database';
import bcrypt from 'bcrypt';
import { Role, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../common/errors/app-error';

export class UserService {
  static async getUsers(params: { search?: string; role?: Role }) {
    const where: Prisma.UserWhereInput = {};

    if (params.role) {
      where.role = params.role;
    }

    if (params.search) {
      const search = params.search.trim();
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  static async createUser(data: {
    email: string;
    password: string;
    fullName: string;
    role: Role;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestError(`User with email '${data.email}' already exists`);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        fullName: data.fullName,
        role: data.role || Role.SALES,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  static async updateUserRole(id: string, newRole: Role) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return prisma.user.update({
      where: { id },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async deleteUser(id: string, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new BadRequestError('You cannot delete your own account');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    await prisma.user.delete({ where: { id } });
    return { success: true, message: 'User account removed successfully' };
  }
}
