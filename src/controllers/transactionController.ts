import type { Request, Response } from 'express';
import {
  checkoutTransactionService,
  deleteTransactionService,
  getAllTransactionsService,
  getTransactionByIdService,
  getStatisticsTransactionService,
  getUserStatisticsTransactionService,
  getDashboardStatsTransactionService
} from '../services/transaction.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse, errorResponse } from '../utils/response';

export class TransactionController {
  constructor(
    private checkoutTransactionSvc: checkoutTransactionService,
    private getTransactionByIdSvc: getTransactionByIdService,
    private getAllTransactionsSvc: getAllTransactionsService,
    private deleteTransactionSvc: deleteTransactionService,
    private getStatisticsTransactionSvc: getStatisticsTransactionService,
    private getUserStatisticsTransactionSvc: getUserStatisticsTransactionService,
    private getDashboardStatsTransactionSvc: getDashboardStatsTransactionService
  ) { }

  // 1. CHECKOUT
  checkout = asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return errorResponse(res, 'User tidak terautentikasi', 401);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'Items wajib berupa array tidak kosong', 400);
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return errorResponse(
          res,
          'Setiap item harus memiliki productId dan quantity > 0',
          400
        );
      }
    }

    try {
      const result = await this.checkoutTransactionSvc.execute(userId, items);
      return successResponse(res, 'Checkout berhasil', result, null, 201);
    } catch (error: any) {
      if (
        error.message.includes('not found') ||
        error.message.includes('Insufficient stock')
      ) {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });

  // 2. GET BY ID
  getTransactionById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    
    try {
      const transaction = await this.getTransactionByIdSvc.execute(id as string);
      return successResponse(res, 'Transaksi ditemukan', transaction);
    } catch (error: any) {
      if (error.message === 'Transaction not found') {
        return errorResponse(res, 'Transaksi tidak ditemukan', 404);
      }
      if (error.message === 'Transaction ID is required') {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });


  getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const userId = req.query.userId as string;

    const result = await this.getAllTransactionsSvc.execute({
      page,
      limit,
      sortBy,
      sortOrder,
      userId
    });

    const pagination = {
      page: result.currentPage,
      limit: limit,
      total: result.totalItems,
      totalPages: result.totalPages
    };

    return successResponse(res, 'Daftar transaksi', result.transactions, pagination);
  });

  // 4. DELETE TRANSACTION
  deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    
    try {
      const transaction = await this.deleteTransactionSvc.execute(id as string);
      return successResponse(res, 'Transaksi berhasil dihapus', transaction);
    } catch (error: any) {
      if (error.message === 'Transaction not found') {
        return errorResponse(res, 'Transaksi tidak ditemukan', 404);
      }
      if (error.message === 'Transaction ID is required') {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });

  // 5. GET STATISTICS
  getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate, userId } = req.query;

    const params: any = {};
    
    if (startDate) {
      params.startDate = new Date(startDate as string);
    }
    
    if (endDate) {
      params.endDate = new Date(endDate as string);
    }
    
    if (userId) {
      params.userId = userId as string;
    }

    try {
      const stats = await this.getStatisticsTransactionSvc.execute(params);
      return successResponse(res, 'Statistik transaksi berhasil diambil', stats);
    } catch (error: any) {
      return errorResponse(res, error.message, 400);
    }
  });

  // 6. GET USER STATISTICS
  getUserStatistics = asyncHandler(async (_req: Request, res: Response) => {
    try {
      const stats = await this.getUserStatisticsTransactionSvc.execute();
      return successResponse(res, 'Statistik pengguna berhasil diambil', stats);
    } catch (error: any) {
      return errorResponse(res, error.message, 400);
    }
  });

  // 7. GET DASHBOARD STATS
  getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
    try {
      const stats = await this.getDashboardStatsTransactionSvc.execute();
      return successResponse(res, 'Dashboard statistik berhasil diambil', stats);
    } catch (error: any) {
      return errorResponse(res, error.message, 400);
    }
  });

  // 8. GET LOW STOCK PRODUCTS (optional)
  getLowStockProducts = asyncHandler(async (_req: Request, res: Response) => {
    try {
      const dashboardStats = await this.getDashboardStatsTransactionSvc.execute();
      return successResponse(
        res,
        'Produk dengan stok menipis berhasil diambil',
        dashboardStats.lowStockProducts
      );
    } catch (error: any) {
      return errorResponse(res, error.message, 400);
    }
  });
}