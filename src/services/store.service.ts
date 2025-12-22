import { StoreRepository } from "../repositories/store.repository";

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class getAllStoresService {
  constructor(private storeRepo: StoreRepository) { }

  async execute(params: findAllParams) {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const sortCriteria: any = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' };

    const stores = await this.storeRepo.findAll(skip, limit, whereClause, sortCriteria);
    const totalItems = await this.storeRepo.countAll(whereClause);

    return {
      stores,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class getStoreByIdService {
  constructor(private storeRepo: StoreRepository) { }

  async execute(id: string) {
    const store = await this.storeRepo.findById(id);
    if (!store) {
      throw new Error('Store not found');
    }
    return store;
  }
}

export class createStoreService {
  constructor(private storeRepo: StoreRepository) { }

  async execute(data: {
    name: string;
    email?: string;
    address?: string;
    userId: string;
  }) {
    const createData: any = {
      name: data.name,
      email: data.email || undefined,
      address: data.address || undefined,
      userId: data.userId,
    };
    return await this.storeRepo.create(createData);
  }
}

export class updateStoreService {
  constructor(private storeRepo: StoreRepository) { }

  async execute(id: string, data: any) {
    const store = await this.storeRepo.findById(id);
    if (!store) {
      throw new Error('Store not found');
    }
    
    const updateData: any = {
      name: data.name || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
    };
    
    return await this.storeRepo.update(id, updateData);
  }
}

export class deleteStoreService {
  constructor(private storeRepo: StoreRepository) { }

  async execute(id: string) {
    const store = await this.storeRepo.findById(id);
    if (!store) {
      throw new Error('Store not found');
    }
    return await this.storeRepo.softDelete(id);
  }
}