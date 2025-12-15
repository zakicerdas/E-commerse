import type { Request, Response } from 'express';
import * as storeService from '../services/store.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllStore = asyncHandler(async (_req: Request, res: Response) => {
  const stores = await storeService.getAllStore();
  return successResponse(res, 'Daftar toko', stores);
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

export const searchStore = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.query;
  const stores = await storeService.searchStore(
    name as string, 
  );
  return successResponse(res, 'Hasil pencarian', stores);
});