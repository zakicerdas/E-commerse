// profile.service.ts
import * as profileRepo from "../repositories/profile.repository";
import type { Profile } from "../generated/client";

export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  const profile = await profileRepo.findProfileByUserId(userId);

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
  // ⬇️ PERHATIAN: Sesuaikan dengan Prisma schema!
  const profileData = {
    userId: data.userId,
    gender: data.gender || null,
    address: data.address || null,
    bio: data.bio || null,
    avatarUrl: data.avatarUrl || null,
    user: { connect: { id: data.userId } }
  };

  return await profileRepo.createProfile(profileData);
};

export const updateProfile = async (
  userId: string,
  data: Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Profile> => {
  await getProfileByUserId(userId);

  const updateData: any = {};
  if (data.gender !== undefined) updateData.gender = data.gender || null;
  if (data.address !== undefined) updateData.address = data.address || null;
  if (data.bio !== undefined) updateData.bio = data.bio || null;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl || null;

  return await profileRepo.updateProfile(userId, updateData);
};

export const deleteProfile = async (userId: string): Promise<Profile> => {
  await getProfileByUserId(userId);
  return await profileRepo.deleteProfile(userId);
};