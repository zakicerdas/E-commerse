import { ProductRepository } from '../repositories/product.repository';
import type { Prisma } from '../generated/client';

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class getAllProductsService {
  constructor(private productRepo: ProductRepository) { }

  async execute(params: findAllParams) {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const sortCriteria: any = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' };

    const products = await this.productRepo.findAll(skip, limit, whereClause, sortCriteria);
    const totalItems = await this.productRepo.countAll(whereClause);

    return {
      products,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class getProductStatsService {
  constructor(private productRepo: ProductRepository) { }

async execute(categoryId?: string) {
  const stats = await this.productRepo.getStatistics(categoryId);
  const categoryStats = await this.productRepo.getProductsByCategoryStats(categoryId); // Teruskan kemari
  
  return {
    overview: stats,
    byCategory: categoryStats
  };
}
}

export class getProductByIdService {
  constructor(private productRepo: ProductRepository) { }

  async execute(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}

export class createProductService {
  constructor(private productRepo: ProductRepository) { }

  async execute(data: {
    name: string;
    price: number;
    stock: number;
    description?: string;
    categoryId: string;
    image?: string;
  }) {
    const createData: Prisma.ProductCreateInput = {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      image: data.image ?? null,
      category: {
        connect: { id: data.categoryId }
      }
    };
    return await this.productRepo.create(createData);
  }
}


export class updateProductService {
  constructor(private productRepo: ProductRepository) { }

  async execute(id: string, data: any) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await this.productRepo.update(id, data);
  }
}

export class deleteProductService {
  constructor(private productRepo: ProductRepository) { }

  async execute(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await this.productRepo.softDelete(id);
  }
}