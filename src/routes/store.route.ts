import { Router } from 'express';
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from '../controllers/storeController';
import { 
  createStoreValidation, 
  getStoreByIdValidation 
} from '../middlewares/store.validation';
import { validate } from '../middlewares/store.validation';

const router = Router();

router.get('/store', getAllStores);
router.get('/store/:id', validate(getStoreByIdValidation), getStoreById);
router.post('/store', validate(createStoreValidation), createStore);
router.put('/store/:id', validate(createStoreValidation), updateStore);
router.delete('/store/:id', validate(getStoreByIdValidation), deleteStore);

export default router;