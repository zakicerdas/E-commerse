import { Router } from 'express';
import { checkout, getDetail, getAllTransactions } from '../controllers/transactionController';

const router = Router();

router.post('/transactions/checkout', checkout);
router.get('/transactions', getAllTransactions);
router.get('/transactions/:id', getDetail);

export default router;