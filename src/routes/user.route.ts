import { Router } from 'express';
import { 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';


const router = Router();
       
router.put('/profile', updateUser);     
router.get('/users', getAllUsers);        
router.get('/users/:id', getUserById);    
router.delete('/users/:id', deleteUser);

export default router;