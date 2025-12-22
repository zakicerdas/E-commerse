import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserRepository } from '../repositories/user.repository';
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService
} from '../services/user.service';
import { authenticate } from '../middlewares/auth.middleware';
const router = Router();


const userRepository = new UserRepository();
const getAllUsersSvc = new getAllUsersService(userRepository);
const getUserByIdSvc = new getUserByIdService(userRepository);
const createUserSvc = new createUserService(userRepository);
const updateUserSvc = new updateUserService(userRepository);
const deleteUserSvc = new deleteUserService(userRepository);

const userController = new UserController(
  getAllUsersSvc,
  getUserByIdSvc,
  createUserSvc,
  updateUserSvc,
  deleteUserSvc
);


router.post('/users', userController.createUser);
router.get('/users', authenticate, userController.getAllUsers);
router.get('/users/:id', authenticate, userController.getUserById);
router.put('/users/:id', authenticate, userController.updateUser);
router.delete('/users/:id', authenticate, userController.deleteUser);

export default router;