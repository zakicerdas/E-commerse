import prisma from '../database';
import type { Prisma } from '../generated/client';

export class StoreRepository {
  async findAll(skip: number, take: number, where: Prisma.StoreWhereInput, orderBy: Prisma.StoreOrderByWithRelationInput) {
    return await prisma.store.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { products: true, user: true }
    });
  }

  async countAll(where: Prisma.StoreWhereInput) {
    return await prisma.store.count({ where });
  }

  async findById(id: string) {
    return await prisma.store.findUnique({
      where: { id, deletedAt: null },
      include: { products: true, user: true }
    });
  }

  async create(data: Prisma.StoreCreateInput) {
    return await prisma.store.create({ data });
  }

  async update(id: string, data: Prisma.StoreUpdateInput) {
    return await prisma.store.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.store.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}