import  prisma  from "../prisma";
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
  page: number;  // Perbaikan: tambahkan ini
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

  const stores = await prisma.store.findMany({
    skip: skip,
    take: limit,
    where: whereClause,
    orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
    include: {
      products: true
    }
  });

  const totalItems = await prisma.store.count({
    where: whereClause
  });

  return {
    data: stores,
    total: totalItems,
    pages: Math.ceil(totalItems / limit),
    page: page, 
    limit: limit 
  };
};

export const getStoreById = async (id: string): Promise<Store> => {
    const store = await prisma.store.findUnique({
        where: { id },
    });
    
    if (!store) {
        throw new Error('Store not found');
    }
    
    return store;
};

export const createStore = async (data: { name: string; email: string; address: string; userId: string }): Promise<Store> => {
    return await prisma.store.create({
        data: {
            name: data.name,
            email: data.email,
            address: data.address,
            userId: data.userId,
        },
    });
};

export const updateStore = async (id: string, data: Partial<Store>): Promise<Store> => {
    await getStoreById(id); // Cek existance

    return await prisma.store.update({
        where: { id },
        data,
    });
};

export const deleteStore = async (id: string): Promise<Store> => {
    await getStoreById(id); // Cek existance

    return await prisma.store.update({
        where: { id },
        data:{
            deletedAt: new Date()
        }
    });
};
