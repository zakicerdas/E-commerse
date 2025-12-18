import type { Request, Response } from 'express';
import * as storeService from '../services/store.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllStores = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = await storeService.getAllStores({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  });

  const totalPages = Math.ceil(result.total / limit);

  return successResponse(res, 'Daftar toko berhasil diambil', result.data, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    pages: totalPages 
  });
});

export const getStoreById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const store = await storeService.getStoreById(id as string);
  return successResponse(res, 'toko ditemukan', store);
});

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const store = await storeService.createStore(req.body);
  return successResponse(res, 'toko berhasil ditambahkan', store, null, 201);
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const store = await storeService.updateStore(id as string, req.body);
  return successResponse(res, 'toko berhasil diupdate', store);
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const store = await storeService.deleteStore(id as string);
  return successResponse(res, 'toko berhasil dihapus', store);
});
