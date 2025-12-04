import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = ProductService.getAllProducts();
  return successResponse(res, 'product list', products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = ProductService.getProductById(id);
  return successResponse(res, 'Product founded', product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = ProductService.createProduct(req.body);
  return successResponse(res, 'Product created succesfully', product, null, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = ProductService.updateProduct(id, req.body);
  return successResponse(res, 'Product update succesfully', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = ProductService.deleteProduct(id);
  return successResponse(res, 'Product deleted succesfully', product);
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { name, max_price, category } = req.query;
  const products = ProductService.searchProducts(
    name as string, 
    max_price ? Number(max_price) : undefined,
    category as string
    

  );
  return successResponse(res, 'search results', products);
});