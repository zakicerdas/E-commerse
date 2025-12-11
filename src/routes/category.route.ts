import { Router } from 'express';
import { getAllCategories, createCategory, getCategoryById} from '../controllers/categoryController';
import { 
  createCategoryValidation,
  getCategoryByIdValidation 
} from '../middlewares/category.validation';
import { validate } from '../utils/validate';



const router = Router();

router.get('/categories', getAllCategories);
router.post('/categories/',validate(createCategoryValidation), createCategory);
router.get('/categories/:id', validate(getCategoryByIdValidation), getCategoryById);


export default router;