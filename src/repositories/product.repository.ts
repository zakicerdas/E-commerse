import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export class ProductRepository {
  async findAll(skip: number, take: number, where: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput) {
    return await prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { category: true, store: true }
    });
  }

  async countAll(where: Prisma.ProductWhereInput) {
    return await prisma.product.count({ where });
  }

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { category: true }
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return await prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return await prisma.product.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}