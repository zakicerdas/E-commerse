import type { Request, Response } from 'express';
import * as profileService from '../services/profile.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const profile = await profileService.getProfileByUserId(userId as string);
  return successResponse(res, 'Profile ditemukan', profile);
});

export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;

  const profileData = {
    userId: req.body.userId,
    gender: req.body.gender,
    address: req.body.address,
    bio: req.body.bio,
    avatarUrl: file ? `/public/uploads/${file.filename}` : req.body.avatarUrl
  };

  const profile = await profileService.createProfile(profileData);
  return successResponse(res, 'Profile berhasil dibuat', profile, null, 201);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const file = req.file;

  const profileData = {
    gender: req.body.gender,
    address: req.body.address,
    bio: req.body.bio,
    avatarUrl: file ? `/public/uploads/${file.filename}` : req.body.avatarUrl
  };

  const profile = await profileService.updateProfile(userId as string, profileData);
  return successResponse(res, 'Profile berhasil diupdate', profile);
});

export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const profile = await profileService.deleteProfile(userId as string);
  return successResponse(res, 'Profile berhasil dihapus', profile);
});