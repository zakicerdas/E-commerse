import { Router } from 'express';
import { 
  getAllCategories, 
  createCategory, 
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { 
  createCategoryValidation,
  getCategoryByIdValidation, 
} from '../middlewares/category.validation';
import { validate } from '../middlewares/category.validation';

const router = Router();

router.get('/categories', getAllCategories);
router.post('/categories', validate(createCategoryValidation), createCategory);
router.get('/categories/:id', validate(getCategoryByIdValidation), getCategoryById);
router.put('/categories/:id', validate(createCategoryValidation), updateCategory);
router.delete('/categories/:id', validate(getCategoryByIdValidation), deleteCategory);

export default router;