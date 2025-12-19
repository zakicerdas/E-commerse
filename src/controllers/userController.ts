import type { Request, Response } from 'express';
import * as UserService from '../services/user.service';
import type { User } from '../generated/client';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';


export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = await UserService.getAllUsers({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  });

  const totalPages = Math.ceil(result.total / limit);

  return successResponse(res, 'Daftar user berhasil diambil', result.data, {
    page: result.page,                                                                                                                                                                          
    limit: result.limit,
    total: result.total,
    pages: totalPages 
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const user = await UserService.getUserById(id as string);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    } else {
      throw error; 
    }
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData: Partial<User> = req.body;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({
      success: false,
      message: 'No data provided for update',
    });
    return;
  }

  try {
    const updatedUser = await UserService.updateUser(id as string, updateData);
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    } else {
      throw error;
    }
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const deletedUser = await UserService.deleteUser(id as string);
    res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'User soft deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    } else {
      throw error;
    }
  }
});

