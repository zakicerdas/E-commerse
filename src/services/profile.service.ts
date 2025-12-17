import prisma from "../prisma";
import type { Profile } from "../generated/client";

export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  const profile = await prisma.profile.findUnique({
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

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

export const createProfile = async (data: {
  userId: string;
  gender?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<Profile> => {
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

export const updateProfile = async (
  userId: string,
  data: Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Profile> => {
  await getProfileByUserId(userId);

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

export const deleteProfile = async (userId: string): Promise<Profile> => {
  await getProfileByUserId(userId);

  return await prisma.profile.delete({
    where: { userId }
  });
};