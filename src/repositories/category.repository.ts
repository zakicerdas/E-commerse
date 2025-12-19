import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export const findAllCategories = async (
  skip: number, 
  take: number, 
  where: Prisma.CategoryWhereInput, 
  orderBy: Record<string, 'asc' | 'desc'>  
) => {
  return await prisma.category.findMany({
    skip,
    take,
    where,
    orderBy,
    include: { products: true }
  });
};

export const countCategories = async (where: Prisma.CategoryWhereInput) => {
  return await prisma.category.count({ where });
};

export const findCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id, deletedAt: null },
    include: { products: true }
  });
};

export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  return await prisma.category.create({ data });
};

export const updateCategory = async (id: string, data: Prisma.CategoryUpdateInput) => {
  return await prisma.category.update({
    where: { id },
    data
  });
};

export const softDeleteCategory = async (id: string) => {
  return await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};