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

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management and statistics endpoints
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create a new checkout transaction
 *     description: Process a checkout transaction with multiple items
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product to purchase
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity to purchase
 *           example:
 *             items:
 *               - productId: "prod-123"
 *                 quantity: 2
 *               - productId: "prod-456"
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Checkout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input data or insufficient stock
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retrieve all transactions with pagination
 *     description: Get a paginated list of all transactions with optional filtering
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter transactions by user ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, totalAmount, status]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Paginated list of transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of transactions
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Retrieve detailed information for a specific transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid transaction ID format
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction by ID
 *     description: Delete a transaction from the system (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID to delete
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/stats/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve comprehensive dashboard statistics for transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *                   description: Total revenue from all transactions
 *                 totalTransactions:
 *                   type: integer
 *                   description: Total number of transactions
 *                 averageOrderValue:
 *                   type: number
 *                   format: float
 *                   description: Average value per order
 *                 todayRevenue:
 *                   type: number
 *                   format: float
 *                   description: Revenue for today
 *                 todayTransactions:
 *                   type: integer
 *                   description: Number of transactions today
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       productName:
 *                         type: string
 *                       quantitySold:
 *                         type: integer
 *                       revenue:
 *                         type: number
 *                         format: float
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/stats/overview:
 *   get:
 *     summary: Get transaction overview statistics
 *     description: Retrieve transaction statistics with optional date filtering
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter statistics by user ID
 *     responses:
 *       200:
 *         description: Transaction statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *                 totalTransactions:
 *                   type: integer
 *                 averageTransactionValue:
 *                   type: number
 *                   format: float
 *                 dailyRevenue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       revenue:
 *                         type: number
 *                         format: float
 *                       transactionCount:
 *                         type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/stats/users:
 *   get:
 *     summary: Get user transaction statistics
 *     description: Retrieve statistics grouped by user
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   totalSpent:
 *                     type: number
 *                     format: float
 *                   transactionCount:
 *                     type: integer
 *                   averageOrderValue:
 *                     type: number
 *                     format: float
 *                   lastTransactionDate:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/stats/low-stock:
 *   get:
 *     summary: Get low stock products
 *     description: Retrieve products with low stock levels (might be from product service)
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Low stock products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   productName:
 *                     type: string
 *                   currentStock:
 *                     type: integer
 *                   minimumStock:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [LOW, CRITICAL]
 *       500:
 *         description: Internal server error
 */

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