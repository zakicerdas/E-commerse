import type { Request, Response } from 'express';
import {
  createProfileService,
  deleteProfileService,
  getAllProfilesService,
  getProfileByIdService,
  updateProfileService
} from '../services/profile.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export class ProfileController {
  constructor(
    private getAllProfilesSvc: getAllProfilesService,
    private getProfileByIdSvc: getProfileByIdService,
    private createProfileSvc: createProfileService,
    private updateProfileSvc: updateProfileService,
    private deleteProfileSvc: deleteProfileService
  ) { }

  getAllProfiles = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await this.getAllProfilesSvc.execute({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    const pagination = {
      page: result.currentPage,
      limit: limit,
      total: result.totalItems,
      totalPages: result.totalPages
    };

    return successResponse(res, 'Daftar profil', result.profiles, pagination);
  });

  getProfileById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const profile = await this.getProfileByIdSvc.execute(userId as string);
    return successResponse(res, 'Profil ditemukan', profile);
  });

  createProfile = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    const avatarUrl = file ? `/public/uploads/${file.filename}` : undefined;

    const profileData: any = {
      userId: req.body.userId,
      gender: req.body.gender || undefined,
      address: req.body.address || undefined,
      bio: req.body.bio || undefined,
      avatarUrl: avatarUrl
    };

    const profile = await this.createProfileSvc.execute(profileData);
    return successResponse(res, 'Profil berhasil ditambahkan', profile, null, 201);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const file = req.file;

    const avatarUrl = file ? `/public/uploads/${file.filename}` : undefined;

    const profileData: any = {
      gender: req.body.gender || undefined,
      address: req.body.address || undefined,
      bio: req.body.bio || undefined,
      ...(avatarUrl && { avatarUrl: avatarUrl })
    };

    const profile = await this.updateProfileSvc.execute(userId as string, profileData);
    return successResponse(res, 'Profil berhasil diupdate', profile);
  });

  deleteProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const profile = await this.deleteProfileSvc.execute(userId as string);
    return successResponse(res, 'Profil berhasil dihapus', profile);
  });
}