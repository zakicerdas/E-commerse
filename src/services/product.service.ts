import type { Product } from '../generated/client';
import * as productRepo from '../repositories/product.repository';

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
  page: number;  
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

  const orderBy = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' } as const;

  const products = await productRepo.findAllProducts(skip, limit, whereClause, orderBy);
  const totalItems = await productRepo.countProducts(whereClause);

  return {
    data: products,
    total: totalItems,
    pages: Math.ceil(totalItems / limit),
    page: page, 
    limit: limit 
  };
};

export const getProductById = async (id: string): Promise<Product> => {
  const product = await productRepo.findProductById(id);
  
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
  const productData = {
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    stock: data.stock,
    image: data.image,
    categoryId: data.categoryId ?? null,
    storeId: data.storeId ?? null
  };
  
  return await productRepo.createProduct(productData);
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  await getProductById(id);

  return await productRepo.updateProduct(id, data);
};

export const deleteProduct = async (id: string): Promise<Product> => {
  await getProductById(id);
  return await productRepo.softDeleteProduct(id);
};