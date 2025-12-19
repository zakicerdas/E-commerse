import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export const findProfileByUserId = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      }
    }
  });
};

export const createProfile = async (data: Prisma.ProfileCreateInput) => {
  return await prisma.profile.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      }
    }
  });
};

export const updateProfile = async (userId: string, data: Prisma.ProfileUpdateInput) => {
  return await prisma.profile.update({
    where: { userId },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      }
    }
  });
};

export const deleteProfile = async (userId: string) => {
  return await prisma.profile.delete({
    where: { userId }
  });
};