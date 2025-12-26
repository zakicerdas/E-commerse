import prisma from '../database';
import type { Prisma } from '../generated/client';

export class ProfileRepository {
  async findAll(skip: number, take: number, where: Prisma.ProfileWhereInput, orderBy: Prisma.ProfileOrderByWithRelationInput) {
    return await prisma.profile.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { user: true }
    });
  }

  async countAll(where: Prisma.ProfileWhereInput) {
    return await prisma.profile.count({ where });
  }

  async findById(id: string) {
    return await prisma.profile .findUnique({
      where: { id, deletedAt: null },
      include: { user: true }
    });
  }

  async create(data: Prisma.ProfileCreateInput) {
    return await prisma.profile.create({ data });
  }

  async update(id: string, data: Prisma.ProfileUpdateInput) {
    return await prisma.profile.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.profile.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}