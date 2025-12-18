import type { Request, Response } from 'express';
import * as ProductService  from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';


 export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = await ProductService.getAllProducts({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  });

  const totalPages = Math.ceil(result.total / limit);

  return successResponse(res, 'Daftar produk berhasil diambil', result.data, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    pages: totalPages 
  });
});


export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await ProductService.getProductById(id as string);
  return successResponse(res, 'Produk ditemukan', product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file; 
  
  if (!file) {
      return res.status(400).json({ message: "Image is required" });
  }
  const imageUrl = `/public/uploads/${file.filename}`;

  const productData = {
      ...req.body,
      price: Number(req.body.price), // Konversi manual karena form-data mengirim string
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      image: imageUrl
  };
  const product = await ProductService.createProduct(productData);
  return successResponse(res, 'Produk berhasil ditambahkan', product, null, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
  
  if (!file) {
      return res.status(400).json({ message: "Image is required" });
  }

  const imageUrl = `/public/uploads/${file.filename}`;

  const productData = {
      ...req.body,
      price: Number(req.body.price), 
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      image: imageUrl
  };
  const id = req.params.id;
  const product = await ProductService.updateProduct(id as string, productData);
  return successResponse(res, 'Produk berhasil diupdate', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await ProductService.deleteProduct(id as string);
  return successResponse(res, 'Produk berhasil dihapus', product);
});
