import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export class CategoryRepository {
  async findAll(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput) {
    return await prisma.category.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { products: true }
    });
  }

  async countAll(where: Prisma.CategoryWhereInput) {
    return await prisma.category.count({ where });
  }

  async findById(id: string) {
    return await prisma.category.findUnique({
      where: { id, deletedAt: null },
      include: { products: true }
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return await prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}