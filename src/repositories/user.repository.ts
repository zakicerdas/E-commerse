// user.repository.ts
import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export const findAllUsers = async (
  skip: number, 
  take: number, 
  where: Prisma.UserWhereInput, 
  orderBy: Record<string, 'asc' | 'desc'>
) => {
  return await prisma.user.findMany({
    skip,
    take,
    where,
    orderBy,
  });
};

export const countUsers = async (where: Prisma.UserWhereInput) => {
  return await prisma.user.count({ where });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id, deletedAt: null },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return await prisma.user.update({
    where: { id },
    data
  });
};

export const softDeleteUser = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};

export const searchUsers = async (
  where: Prisma.UserWhereInput
) => {
  return await prisma.user.findMany({
    where,
  });
};