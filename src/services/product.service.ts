import prisma from '../prisma';
import type { Product } from '../generated/client';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProductListResponse {
  data: Product[];
  total: number;
  pages: number;
  page: number;  // Perbaikan: tambahkan ini
  limit: number;
}

export const getAllProducts = async (params: FindAllParams): Promise<ProductListResponse> => {
  const { page, limit, search, sortBy, sortOrder } = params;

  const skip = (page - 1) * limit;

  const whereClause: any = {
    deletedAt: null 
  };

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const products = await prisma.product.findMany({
    skip: skip,
    take: limit,
    where: whereClause,
    orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
    include: {
      category: true
    }
  });

  const totalItems = await prisma.product.count({
    where: whereClause
  });

  return {
    data: products,
    total: totalItems,
    pages: Math.ceil(totalItems / limit),
    page: page, 
    limit: limit 
  };
};

export const getProductById = async (id: string): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

export const createProduct = async (data: { 
  name: string; 
  price: number; 
  stock: number;
  description?: string;
  categoryId?: string;
  storeId?: string; 
  image: string;
}): Promise<Product> => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId ?? null,
      storeId: data.storeId ?? null,
      image: data.image,
    },
  });
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  await getProductById(id); 

  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string): Promise<Product> => {
  await getProductById(id); // Cek existance

  return await prisma.product.update({
    where: { id },
    data:{
      deletedAt: new Date
    }
  });
};
