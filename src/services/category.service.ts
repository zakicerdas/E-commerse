import type { Category } from "#generated/client";
import * as categoryRepo from "../repositories/category.repository";

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CategoryListResponse {
  data: Category[];
  total: number;
  pages: number;
  page: number;  
  limit: number;
}

export const getAllCategories = async (params: FindAllParams): Promise<CategoryListResponse> => {
  const { page, limit, search, sortBy, sortOrder } = params;
  const skip = (page - 1) * limit;

  const whereClause: any = {
    deletedAt: null 
  };

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const orderBy = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' } as const;

  const categories = await categoryRepo.findAllCategories(skip, limit, whereClause, orderBy);
  const totalItems = await categoryRepo.countCategories(whereClause);

  return {
    data: categories,
    total: totalItems,
    pages: Math.ceil(totalItems / limit),
    page: page, 
    limit: limit 
  };
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const category = await categoryRepo.findCategoryById(id);
    
    if (!category) {
        throw new Error('Category not found');
    }
    
    return category;
};

export const createCategory = async (data: { name: string }): Promise<Category> => {
 const category = { name: data.name };

 return await categoryRepo.createCategory(category);
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    await getCategoryById(id); 

    return await categoryRepo.updateCategory(id, data);
};

export const deleteCategory = async (id: string): Promise<Category> => {
    await getCategoryById(id);

    return await categoryRepo.softDeleteCategory(id);
};
