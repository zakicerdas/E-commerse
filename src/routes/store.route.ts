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