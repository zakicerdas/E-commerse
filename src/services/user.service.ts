import * as userRepo from "../repositories/user.repository";
import type { User } from "../generated/client";
import bcrypt from 'bcrypt';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UserListResponse {
  data: User[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export const getAllUsers = async (params: FindAllParams): Promise<UserListResponse> => {
  const { page, limit, search, sortBy, sortOrder } = params;
  const skip = (page - 1) * limit;

  const whereClause: any = {
    deletedAt: null
  };

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const orderBy = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' } as const;

  const users = await userRepo.findAllUsers(skip, limit, whereClause, orderBy);
  const totalItems = await userRepo.countUsers(whereClause);

  return {
    data: users,
    total: totalItems,
    pages: Math.ceil(totalItems / limit),
    page: page,
    limit: limit
  };
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await userRepo.findUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const createUser = async (data: { name: string; email: string; password: string }): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const userData = {
    username: data.name,
    email: data.email,
    password: hashedPassword,
  };

  return await userRepo.createUser(userData);
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  await getUserById(id);

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await userRepo.updateUser(id, data);
};

export const deleteUser = async (id: string): Promise<User> => {
  await getUserById(id);
  return await userRepo.softDeleteUser(id);
};