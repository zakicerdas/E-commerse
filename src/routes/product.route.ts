import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/productController';
import { 
  createProductValidation, 
  getProductByIdValidation 
} from '../middlewares/product.validation';
import { validate } from '../utils/validate';
import { upload } from '../middlewares/upload.middleware';


const router = Router();

router.get('/products', getAllProducts);
router.get('/products/search', searchProducts);
router.get('/products/:id', validate(getProductByIdValidation), getProductById);
router.post('/products', validate(createProductValidation), createProduct, upload.single('image'));
router.put('/products/:id', validate(createProductValidation), updateProduct, upload.single('image'));
router.delete('/products/:id', validate(getProductByIdValidation), deleteProduct);

export default router;