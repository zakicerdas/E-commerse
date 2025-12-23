import prisma from "../prisma";
import type { Prisma } from "../generated/client";

export class TransactionRepository {
  async checkout(userId: string, items: { productId: string; quantity: number }[]) {
    return await prisma.$transaction(async (tx) => {
      let total = 0;
      const transactionItemsData = [];

      // Loop setiap item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const currentPrice = Number(product.price);
        total += currentPrice * item.quantity;

        transactionItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: product.price
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Buat transaksi
      return await tx.transaction.create({
        data: {
          userId,
          total,
          items: {
            create: transactionItemsData
          }
        },
        include: {
          user: true,
          items: {
            include: { product: true }
          }
        }
      });
    });
  }

  // 2. GET BY ID
  async findById(id: string) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    });
  }

  // 3. FIND ALL dengan pagination
  async findAll(skip: number, take: number, where: any, orderBy: any) {
    return await prisma.transaction.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    });
  }

  // 4. COUNT ALL
  async countAll(where: any) {
    return await prisma.transaction.count({ where });
  }

  // 5. DELETE (soft delete)
  async delete(id: string) {
    const transaction = await this.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return await prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    });
  }

  // 6. GET STATISTICS
  async getStatistics(params?: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }) {
    const { startDate, endDate, userId } = params || {};

    const where: Prisma.TransactionWhereInput = {
      deletedAt: null
    };

    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;
      where.createdAt = dateFilter;
    }

    if (userId) {
      where.userId = userId;
    }

    return await prisma.transaction.aggregate({
      where,
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true },
      _min: { total: true },
      _max: { total: true }
    });
  }

  // 7. GET TRANSACTIONS BY USER STATS
  async getTransactionsByUserStats() {
    return await prisma.transaction.groupBy({
      by: ['userId'],
      where: { deletedAt: null },
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true },
      orderBy: {
        _sum: {
          total: 'desc'
        }
      }
    });
  }

  // 8. GET DASHBOARD STATS
  async getDashboardStats() {
    const [statistics, userStats, recentTransactions] = await Promise.all([
      this.getStatistics(),
      this.getTransactionsByUserStats(),
      prisma.transaction.findMany({
        where: { deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lt: 10 },
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        category: {
          select: { name: true }
        }
      },
      orderBy: { stock: 'asc' },
      take: 5
    });

    return {
      overview: statistics,
      userStatistics: userStats,
      recentTransactions,
      lowStockProducts
    };
  }
}