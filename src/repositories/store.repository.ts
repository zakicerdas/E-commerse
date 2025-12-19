import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export const findAllStores = async (
  skip: number, 
  take: number, 
  where: Prisma.StoreWhereInput, 
  orderBy: Record<string, 'asc' | 'desc'>  
) => {
  return await prisma.store.findMany({
    skip,
    take,
    where,
    orderBy,
    include: { products: true }
  });
};

export const countStores = async (where: Prisma.StoreWhereInput) => {
  return await prisma.store.count({ where });
};

export const findStoreById = async (id: string) => {
  return await prisma.store.findUnique({
    where: { id, deletedAt: null },
    include: { products: true }
  });
};

export const createStore = async (data: Prisma.StoreCreateInput) => {
  return await prisma.store.create({ data });
};

export const updateStore = async (id: string, data: Prisma.StoreUpdateInput) => {
  return await prisma.store.update({
    where: { id },
    data
  });
};

export const softDeleteStore = async (id: string) => {
  return await prisma.store.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};