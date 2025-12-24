import { Router } from 'express';
import {
  StoreController
} from '../controllers/storeController';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { StoreRepository } from '../repositories/store.repository';
import { createStoreService, deleteStoreService, getAllStoresService, getStoreByIdService, updateStoreService } from '../services/store.service';
import {
  createStoreValidation,
  getStoreByIdValidation
} from '../middlewares/store.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management endpoints
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Retrieve all stores with pagination
 *     description: Get a paginated list of all stores with optional search and sorting
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for store name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt]
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
 *         description: Paginated list of stores retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Store'
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of stores
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     description: Retrieve detailed information for a specific store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Invalid store ID format
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     description: Add a new store to the system (requires user ID)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreInput'
 *           example:
 *             name: "Main Store"
 *             email: "store@example.com"
 *             address: "123 Main Street, City"
 *             userId: "user-123"
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: User not found
 *       409:
 *         description: Store with same name already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update existing store
 *     description: Update details of an existing store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreInput'
 *           example:
 *             name: "Updated Store Name"
 *             email: "updated@example.com"
 *             address: "456 New Street, City"
 *     responses:
 *       200:
 *         description: Store updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete store by ID
 *     description: Soft delete a store from the system
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID to delete
 *     responses:
 *       200:
 *         description: Store soft deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */

const storeRepository = new StoreRepository();
const getAllStoresSvc = new getAllStoresService(storeRepository);
const getStoreByIdSvc = new getStoreByIdService(storeRepository);
const createStoreSvc = new createStoreService(storeRepository);
const updateStoreSvc = new updateStoreService(storeRepository);
const deleteStoreSvc = new deleteStoreService(storeRepository);
const storeController = new StoreController(
  getAllStoresSvc,
  getStoreByIdSvc,
  createStoreSvc,
  updateStoreSvc,
  deleteStoreSvc
);

router.get('/stores', authenticate, storeController.getAllStores);
router.get('/stores/:id', authenticate, validate(getStoreByIdValidation), storeController.getStoreById);
router.post('/stores', authenticate, validate(createStoreValidation), storeController.createStore);
router.put('/stores/:id', authenticate, validate(createStoreValidation), storeController.updateStore);
router.delete('/stores/:id', authenticate, validate(getStoreByIdValidation), storeController.deleteStore);

export default router;