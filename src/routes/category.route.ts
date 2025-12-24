import { Router } from 'express';
import {
  CategoryController
} from '../controllers/categoryController';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { CategoryRepository } from '../repositories/category.repository';
import { createCategoryService, getAllCategoriesService, getCategoryByIdService, updateCategoryService, deleteCategoryService } from '../services/category.service';
import {
  createCategoryValidation,
  getCategoryByIdValidation
} from '../middlewares/category.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories with pagination
 *     description: Get a paginated list of all categories with optional search and sorting
 *     tags: [Categories]
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
 *         description: Search term for category name
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
 *         description: Paginated list of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of categories
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
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a specific category by its ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid category ID format
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Add a new category to the system
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Electronics"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update existing category
 *     description: Update details of an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Updated Electronics"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     description: Soft delete a category from the system
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to delete
 *     responses:
 *       200:
 *         description: Category soft deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

const categoryRepository = new CategoryRepository();
const getAllCategoriesSvc = new getAllCategoriesService(categoryRepository);
const getCategoryByIdSvc = new getCategoryByIdService(categoryRepository);
const createCategorySvc = new createCategoryService(categoryRepository);
const updateCategorySvc = new updateCategoryService(categoryRepository);
const deleteCategorySvc = new deleteCategoryService(categoryRepository);
const categoryController = new CategoryController(
  getAllCategoriesSvc,
  getCategoryByIdSvc,
  createCategorySvc,
  updateCategorySvc,
  deleteCategorySvc
);

router.get('/categories', authenticate, categoryController.getAllCategories);
router.get('/categories/:id', authenticate, validate(getCategoryByIdValidation), categoryController.getCategoryById);
router.post('/categories', authenticate, validate(createCategoryValidation), categoryController.createCategory);
router.put('/categories/:id', authenticate, validate(createCategoryValidation), categoryController.updateCategory);
router.delete('/categories/:id', authenticate, validate(getCategoryByIdValidation), categoryController.deleteCategory);

export default router;