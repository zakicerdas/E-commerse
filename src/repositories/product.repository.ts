import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export const findAllProducts = async (
  skip: number, 
  take: number, 
  where: Prisma.ProductWhereInput, 
  orderBy: Record<string, 'asc' | 'desc'>  
) => {
  return await prisma.product.findMany({
    skip,
    take,
    where,
    orderBy,
    include: { category: true }
  });
};

export const countProducts = async (where: Prisma.ProductWhereInput) => {
  return await prisma.product.count({ where });
};

export const findProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id, deletedAt: null },
    include: { category: true }
  });
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return await prisma.product.create({ data });
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  return await prisma.product.update({
    where: { id },
    data
  });
};

export const softDeleteProduct = async (id: string) => {
  return await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};