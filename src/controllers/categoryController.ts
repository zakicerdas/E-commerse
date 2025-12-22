import type { Request, Response } from 'express';
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService
} from '../services/category.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export class CategoryController {
  constructor(
    private getAllCategoriesSvc: getAllCategoriesService,
    private getCategoryByIdSvc: getCategoryByIdService,
    private createCategorySvc: createCategoryService,
    private updateCategorySvc: updateCategoryService,
    private deleteCategorySvc: deleteCategoryService
  ) { }

  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await this.getAllCategoriesSvc.execute({
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

    return successResponse(res, 'Daftar kategori', result.categories, pagination);
  });

  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await this.getCategoryByIdSvc.execute(id as string);
    return successResponse(res, 'Kategori ditemukan', category);
  });


 createCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryData = {
      name: req.body.name
    };
    const category = await this.createCategorySvc.execute(categoryData);
    return successResponse(res, 'Kategori berhasil ditambahkan', category, null, 201);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const categoryData = {
      name: req.body.name
    };
    const category = await this.updateCategorySvc.execute(id as string, categoryData);
    return successResponse(res, 'Kategori berhasil diupdate', category);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await this.deleteCategorySvc.execute(id as string);
    return successResponse(res, 'Kategori berhasil dihapus', category);
  });
}