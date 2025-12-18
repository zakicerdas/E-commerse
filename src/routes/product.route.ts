import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { 
  createProductValidation, 
  getProductByIdValidation 
} from '../middlewares/product.validation';
import { validate } from '../utils/validate';
import { upload } from '../middlewares/upload.middleware';


const router = Router();

router.get('/products', getAllProducts);
router.get('/products/:id', validate(getProductByIdValidation), getProductById);
router.post('/products', upload.single('image'), validate(createProductValidation), createProduct);
router.put('/products/:id', upload.single('image'), validate(createProductValidation), updateProduct);
router.delete('/products/:id', validate(getProductByIdValidation), deleteProduct);

export default router;