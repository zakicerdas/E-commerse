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