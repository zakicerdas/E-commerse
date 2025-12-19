import * as storeRepo from "../repositories/store.repository";
import type { Store } from "../generated/client";

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface StoreListResponse {
    data: Store[];
  total: number;
  pages: number;
  page: number;  
  limit: number;
}

export const getAllStores = async (params: FindAllParams): Promise<StoreListResponse> => {
  const { page, limit, search, sortBy, sortOrder } = params;

  const skip = (page - 1) * limit;

  const whereClause: any = {
    deletedAt: null 
  };

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

   const orderBy = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' } as const;

    const stores = await storeRepo.findAllStores(skip, limit, whereClause, orderBy);
    const totalItems = await storeRepo.countStores(whereClause);

    return {
      data: stores,
      total: totalItems,
      pages: Math.ceil(totalItems / limit),
      page: page, 
      limit: limit 
    };
};

export const getStoreById = async (id: string): Promise<Store> => {
    const store = await storeRepo.findStoreById(id);
    
    if (!store) {
        throw new Error('Store not found');
    }
    
    return store;
};

export const createStore = async (data: { name: string; email: string; address: string; userId: string }): Promise<Store> => {
    const storeData = { 
        name: data.name,
        email: data.email,
        address: data.address,
        user: { connect: { id: data.userId } }
    };
    return await storeRepo.createStore(storeData);
};

export const updateStore = async (id: string, data: Partial<Store>): Promise<Store> => {
    await getStoreById(id);

    return await storeRepo.updateStore(id, data);
};

export const deleteStore = async (id: string): Promise<Store> => {
    await getStoreById(id);

    return await storeRepo.softDeleteStore(id);
};
