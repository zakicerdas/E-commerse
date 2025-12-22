import { CategoryRepository } from '../repositories/category.repository';

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class getAllCategoriesService {
  constructor(private categoryRepo: CategoryRepository) { }

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

    const categories = await this.categoryRepo.findAll(skip, limit, whereClause, sortCriteria);
    const totalItems = await this.categoryRepo.countAll(whereClause);

    return {
      categories,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class getCategoryByIdService {
  constructor(private categoryRepo: CategoryRepository) { }

  async execute(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}

export class createCategoryService {
  constructor(private categoryRepo: CategoryRepository) { }

  async execute(data: {
    name: string;
  }) {
    const createData = {
      name: data.name,
    };
    return await this.categoryRepo.create(createData);
  }
}

export class updateCategoryService {
  constructor(private categoryRepo: CategoryRepository) { }

  async execute(id: string, data: any) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await this.categoryRepo.update(id, data);
  }
}

export class deleteCategoryService {
  constructor(private categoryRepo: CategoryRepository) { }

  async execute(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await this.categoryRepo.softDelete(id);
  }
}