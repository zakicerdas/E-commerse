import type { Request, Response } from 'express';
import * as categoryService  from '../services/category.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

 export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = await categoryService.getAllCategories({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  });

  const totalPages = Math.ceil(result.total / limit);

  return successResponse(res, 'Daftar kategori berhasil diambil', result.data, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    pages: totalPages 
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await categoryService.getCategoryById(id as string);
  return successResponse(res, 'Kategori ditemukan', category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  return successResponse(res, 'Kategori berhasil ditambahkan', category, null, 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await categoryService.updateCategory(id as string, req.body);
  return successResponse(res, 'Kategori berhasil diupdate', category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await categoryService.deleteCategory(id as string);
  return successResponse(res, 'Kategori berhasil dihapus', category);
});
