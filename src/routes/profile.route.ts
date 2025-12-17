import { Router } from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController';
import {
  createProfileValidation,
  updateProfileValidation,
  getProfileValidation,
  validate
} from '../middlewares/profile.validation';

const router = Router();

router.get('/profile/:userId', validate(getProfileValidation), getProfile);
router.post('/profile', validate(createProfileValidation), createProfile);
router.put('/profile/:userId', validate(updateProfileValidation), updateProfile);
router.delete('/profile/:userId', validate(getProfileValidation), deleteProfile);

export default router;