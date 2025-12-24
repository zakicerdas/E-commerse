import { Router } from 'express';
import {
  ProductController
} from '../controllers/productController';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { ProductRepository } from '../repositories/product.repository';
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, getProductStatsService, updateProductService } from '../services/product.service';
import { upload } from '../middlewares/upload.middleware';
import {
  createProductValidation,
  getProductByIdValidation
} from '../middlewares/product.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products with pagination
 *     description: Get a paginated list of all products with optional search and sorting
 *     tags: [Products]
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
 *         description: Search term for product name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, stock, createdAt, updatedAt]
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
 *         description: Paginated list of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of products
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
 * /products/stats:
 *   get:
 *     summary: Get product statistics
 *     description: Retrieve product statistics including overview and category-based stats
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Optional category ID to filter statistics
 *     responses:
 *       200:
 *         description: Product statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                     totalStock:
 *                       type: integer
 *                     averagePrice:
 *                       type: number
 *                       format: float
 *                     lowStockCount:
 *                       type: integer
 *                 byCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryId:
 *                         type: string
 *                       categoryName:
 *                         type: string
 *                       productCount:
 *                         type: integer
 *                       totalStock:
 *                         type: integer
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve detailed information for a specific product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID format
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the system (can include image upload)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Product price
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Product stock quantity
 *               categoryId:
 *                 type: string
 *                 description: Category ID for the product
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *           encoding:
 *             image:
 *               contentType: image/jpeg, image/png, image/gif, image/webp
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Product with same name already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update existing product
 *     description: Update details of an existing product (can include image update)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Product price
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Product stock quantity
 *               categoryId:
 *                 type: string
 *                 description: Category ID for the product
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *           encoding:
 *             image:
 *               contentType: image/jpeg, image/png, image/gif, image/webp
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Product or category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     description: Soft delete a product from the system
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to delete
 *     responses:
 *       200:
 *         description: Product soft deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

const productRepository = new ProductRepository();
const getAllProductsSvc = new getAllProductsService(productRepository);
const getProductByIdSvc = new getProductByIdService(productRepository);
const createProductSvc = new createProductService(productRepository);
const updateProductSvc = new updateProductService(productRepository);
const deleteProductSvc = new deleteProductService(productRepository);
const getProductStatsSvc = new getProductStatsService(productRepository);
const productController = new ProductController(
  getAllProductsSvc,
  getProductByIdSvc,
  createProductSvc,
  updateProductSvc,
  deleteProductSvc,
  getProductStatsSvc
);

router.get('/products', authenticate, productController.getAllProducts);
router.get('/products/stats', authenticate, productController.getStats);
router.get('/products/:id', authenticate, validate(getProductByIdValidation), productController.getProductById);
router.post('/products', authenticate, upload.single('image'), validate(createProductValidation), productController.createProduct);
router.put('/products/:id', authenticate, upload.single('image'), validate(createProductValidation), productController.updateProduct);
router.delete('/products/:id', authenticate, validate(getProductByIdValidation), productController.deleteProduct);

export default router;