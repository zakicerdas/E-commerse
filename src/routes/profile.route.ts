import { Router } from 'express';
import {
  ProfileController
} from '../controllers/profileController';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { ProfileRepository } from '../repositories/profile.repository';
import { 
  createProfileService, 
  deleteProfileService, 
  getAllProfilesService, 
  getProfileByIdService, 
  updateProfileService 
} from '../services/profile.service';
import { upload } from '../middlewares/upload.middleware';
import {
  createProfileValidation,
  getProfileByIdValidation,
  updateProfileValidation
} from '../middlewares/profile.validation';

const router = Router();

const profileRepository = new ProfileRepository();
const getAllProfilesSvc = new getAllProfilesService(profileRepository);
const getProfileByIdSvc = new getProfileByIdService(profileRepository);
const createProfileSvc = new createProfileService(profileRepository);
const updateProfileSvc = new updateProfileService(profileRepository);
const deleteProfileSvc = new deleteProfileService(profileRepository);

const profileController = new ProfileController(
  getAllProfilesSvc,
  getProfileByIdSvc,
  createProfileSvc,
  updateProfileSvc,
  deleteProfileSvc
);

router.get('/profiles', authenticate, profileController.getAllProfiles);
router.get('/profiles/:userId', authenticate, validate(getProfileByIdValidation), profileController.getProfileById);
router.post('/profiles', authenticate, upload.single('avatar'), validate(createProfileValidation), profileController.createProfile);
router.put('/profiles/:userId', authenticate, upload.single('avatar'), validate(updateProfileValidation), profileController.updateProfile);
router.delete('/profiles/:userId', authenticate, validate(getProfileByIdValidation), profileController.deleteProfile);

export default router;
