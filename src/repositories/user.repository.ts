import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export class UserRepository {
  async findAll(skip: number, take: number, where: Prisma.UserWhereInput, orderBy: Prisma.UserOrderByWithRelationInput) {
    return await prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { profiles: true, stores: true }
    });
  }

  async countAll(where: Prisma.UserWhereInput) {
    return await prisma.user.count({ where });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { profiles: true, stores: true }
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}