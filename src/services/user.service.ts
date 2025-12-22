import { UserRepository } from "../repositories/user.repository";
import bcrypt from 'bcrypt';

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class getAllUsersService {
  constructor(private userRepo: UserRepository) { }

  async execute(params: findAllParams) {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const sortCriteria: any = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' };

    const users = await this.userRepo.findAll(skip, limit, whereClause, sortCriteria);
    const totalItems = await this.userRepo.countAll(whereClause);

    return {
      users,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class getUserByIdService {
  constructor(private userRepo: UserRepository) { }

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export class createUserService {
  constructor(private userRepo: UserRepository) { }

  async execute(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createData: any = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    };
    return await this.userRepo.create(createData);
  }
}

export class updateUserService {
  constructor(private userRepo: UserRepository) { }

  async execute(id: string, data: any) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.userRepo.update(id, data);
  }
}

export class deleteUserService {
  constructor(private userRepo: UserRepository) { }

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.userRepo.softDelete(id);
  }
}