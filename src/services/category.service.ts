import  prisma  from "../prisma";
import type { Category } from "../generated/client";

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
  page: number;  // Perbaikan: tambahkan ini
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

  const categories = await prisma.category.findMany({
    skip: skip,
    take: limit,
    where: whereClause,
    orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
    include: {
      products: true
    }
  });

  const totalItems = await prisma.category.count({
    where: whereClause
  });

  return {
    data: categories,
    total: totalItems,
    pages: Math.ceil(totalItems / limit),
    page: page, 
    limit: limit 
  };
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const category = await prisma.category.findUnique({
        where: { id },
    });
    
    if (!category) {
        throw new Error('Category not found');
    }
    
    return category;
};

export const createCategory = async (data: { name: string }): Promise<Category> => {
    return await prisma.category.create({
        data: {
            name: data.name,
        },
    });
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    await getCategoryById(id); // Cek existance

    return await prisma.category.update({
        where: { id },
        data,
    });
};

export const deleteCategory = async (id: string): Promise<Category> => {
    await getCategoryById(id); // Cek existance

    return await prisma.category.update({
        where: { id },
         data:{
            deletedAt: new Date()
        }
    });
};
