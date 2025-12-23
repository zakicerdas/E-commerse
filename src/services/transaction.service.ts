import { TransactionRepository } from "../repositories/transaction.repository";

export class checkoutTransactionService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute(userId: string, items: { productId: string; quantity: number }[]) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!items || items.length === 0) {
      throw new Error('Items cannot be empty');
    }

    for (const item of items) {
      if (!item.productId || item.quantity <= 0) {
        throw new Error('Invalid item data');
      }
    }

    return await this.transactionRepo.checkout(userId, items);
  }
}

export class getTransactionByIdService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute(id: string) {
    if (!id) {
      throw new Error('Transaction ID is required');
    }

    const transaction = await this.transactionRepo.findById(id);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }
}

export class getAllTransactionsService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute(params: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
  }) {
    const { page, limit, sortBy, sortOrder, userId } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null
    };

    if (userId) {
      where.userId = userId;
    }

    const orderBy: any = sortBy 
      ? { [sortBy]: sortOrder || 'desc' } 
      : { createdAt: 'desc' };

    const transactions = await this.transactionRepo.findAll(skip, limit, where, orderBy);
    const totalItems = await this.transactionRepo.countAll(where);

    return {
      transactions,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class deleteTransactionService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute(id: string) {
    if (!id) {
      throw new Error('Transaction ID is required');
    }

    return await this.transactionRepo.delete(id);
  }
}

export class getStatisticsTransactionService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute(params?: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }) {
    return await this.transactionRepo.getStatistics(params);
  }
}

export class getUserStatisticsTransactionService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute() {
    return await this.transactionRepo.getTransactionsByUserStats();
  }
}

export class getDashboardStatsTransactionService {
  constructor(private transactionRepo: TransactionRepository) { }

  async execute() {
    return await this.transactionRepo.getDashboardStats();
  }
}