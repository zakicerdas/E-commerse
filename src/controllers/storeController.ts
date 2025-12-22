import type { Request, Response } from 'express';
import {
  createStoreService,
  deleteStoreService,
  getAllStoresService,
  getStoreByIdService,
  updateStoreService
} from '../services/store.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export class StoreController {
  constructor(
    private getAllStoresSvc: getAllStoresService,
    private getStoreByIdSvc: getStoreByIdService,
    private createStoreSvc: createStoreService,
    private updateStoreSvc: updateStoreService,
    private deleteStoreSvc: deleteStoreService
  ) { }

  getAllStores = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await this.getAllStoresSvc.execute({
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

    return successResponse(res, 'Daftar toko', result.stores, pagination);
  });

  getStoreById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const store = await this.getStoreByIdSvc.execute(id as string);
    return successResponse(res, 'Toko ditemukan', store);
  });


  createStore = asyncHandler(async (req: Request, res: Response) => {
    const storeData = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      userId: req.body.userId
    };
    const store = await this.createStoreSvc.execute(storeData);
    return successResponse(res, 'Toko berhasil ditambahkan', store, null, 201);
  });

  updateStore = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const storeData = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address
    };
    const store = await this.updateStoreSvc.execute(id as string, storeData);
    return successResponse(res, 'Toko berhasil diupdate', store);
  });

  deleteStore = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const store = await this.deleteStoreSvc.execute(id as string);
    return successResponse(res, 'Toko berhasil dihapus', store);
  });
}