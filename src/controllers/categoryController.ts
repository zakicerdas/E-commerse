import type { Request, Response } from 'express';
import * as categoryService  from '../services/category.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return successResponse(res, 'Daftar kategori', categories);
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

export const searchCategories = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.query;
  const categories = await categoryService.searchCategories(
    name as string, 
  );
  return successResponse(res, 'Hasil pencarian', categories);
});