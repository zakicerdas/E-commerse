import type { Request, Response } from 'express';
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService
} from '../services/user.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export class UserController {
  constructor(
    private getAllUsersSvc: getAllUsersService,
    private getUserByIdSvc: getUserByIdService,
    private createUserSvc: createUserService,
    private updateUserSvc: updateUserService,
    private deleteUserSvc: deleteUserService
  ) { }

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await this.getAllUsersSvc.execute({
      page,
      limit,
      search,
      sortBy,
      sortOrder
    });

    const pagination = {
      page: result.currentPage,
      limit: limit,
      total: result.totalItems,
      totalPages: result.totalPages
    };

    return successResponse(res, 'Daftar user berhasil diambil', result.users, pagination);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await this.getUserByIdSvc.execute(id as string);
    return successResponse(res, 'User ditemukan', user);
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    const user = await this.createUserSvc.execute(userData);
    return successResponse(res, 'User berhasil ditambahkan', user, null, 201);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const userData: any = {
      name: req.body.name || undefined,
      email: req.body.email || undefined,
      password: req.body.password || undefined
    };

    const user = await this.updateUserSvc.execute(id as string, userData);
    return successResponse(res, 'User berhasil diupdate', user);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await this.deleteUserSvc.execute(id as string);
    return successResponse(res, 'User berhasil dihapus', user);
  });
}