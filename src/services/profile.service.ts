import { ProfileRepository } from "../repositories/profile.repository";

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class getAllProfilesService {
  constructor(private profileRepo: ProfileRepository) { }

  async execute(params: findAllParams) {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (search) {
      whereClause.user = {
        is: {
          name: { contains: search, mode: 'insensitive' }
        }
      };
    }

    const sortCriteria: any = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' };

    const profiles = await this.profileRepo.findAll(skip, limit, whereClause, sortCriteria);
    const totalItems = await this.profileRepo.countAll(whereClause);

    return {
      profiles,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class getProfileByIdService {
  constructor(private profileRepo: ProfileRepository) { }

  async execute(userId: string) {
    const profile = await this.profileRepo.findById(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }
}

export class createProfileService {
  constructor(private profileRepo: ProfileRepository) { }

  async execute(data: {
    gender?: string;
    address?: string;
    bio?: string;
    avatarUrl?: string;
    userId: string;
  }) {
    const createData: any = {
      gender: data.gender || undefined,
      address: data.address || undefined,
      bio: data.bio || undefined,
      avatarUrl: data.avatarUrl || undefined,
      userId: data.userId
    };
    return await this.profileRepo.create(createData);
  }
}

export class updateProfileService {
  constructor(private profileRepo: ProfileRepository) { }

  async execute(userId: string, data: any) {
    const profile = await this.profileRepo.findById(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const updateData: any = {
      gender: data.gender || undefined,
      address: data.address || undefined,
      bio: data.bio || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };

    return await this.profileRepo.update(userId, updateData);
  }
}

export class deleteProfileService {
  constructor(private profileRepo: ProfileRepository) { }

  async execute(userId: string) {
    const profile = await this.profileRepo.findById(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return await this.profileRepo.softDelete(userId);
  }
}