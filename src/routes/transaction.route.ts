// transaction.route.ts
import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticate } from '../middlewares/auth.middleware';
import { TransactionRepository } from '../repositories/transaction.repository';
import {
  checkoutTransactionService,
  deleteTransactionService,
  getAllTransactionsService,
  getTransactionByIdService,
  getStatisticsTransactionService,
  getUserStatisticsTransactionService,
  getDashboardStatsTransactionService
} from '../services/transaction.service';

const router = Router();

const transactionRepository = new TransactionRepository();

const checkoutTransactionSvc = new checkoutTransactionService(transactionRepository);
const getTransactionByIdSvc = new getTransactionByIdService(transactionRepository);
const getAllTransactionsSvc = new getAllTransactionsService(transactionRepository);
const deleteTransactionSvc = new deleteTransactionService(transactionRepository);
const getStatisticsTransactionSvc = new getStatisticsTransactionService(transactionRepository);
const getUserStatisticsTransactionSvc = new getUserStatisticsTransactionService(transactionRepository);
const getDashboardStatsTransactionSvc = new getDashboardStatsTransactionService(transactionRepository);

const transactionController = new TransactionController(
  checkoutTransactionSvc,
  getTransactionByIdSvc,
  getAllTransactionsSvc,
  deleteTransactionSvc,
  getStatisticsTransactionSvc,
  getUserStatisticsTransactionSvc,
  getDashboardStatsTransactionSvc
);

router.post('/checkout', authenticate, transactionController.checkout);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.delete('/:id', authenticate, transactionController.deleteTransaction);
router.get('/stats/dashboard', transactionController.getDashboardStats);
router.get('/stats/overview', transactionController.getStatistics);
router.get('/stats/users', transactionController.getUserStatistics);
router.get('/stats/low-stock', transactionController.getLowStockProducts);

export default router;