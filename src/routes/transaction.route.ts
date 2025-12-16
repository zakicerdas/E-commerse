import { Router } from 'express';
import { checkout, getDetail, getAllTransactions } from '../controllers/transactionController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/transactions/checkout',authenticate, checkout);
router.get('/transactions', getAllTransactions);
router.get('/transactions/:id', getDetail);

export default router;