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

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: User profile management endpoints
 */

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Retrieve all profiles with pagination
 *     description: Get a paginated list of all user profiles with optional search and sorting
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for user name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Paginated list of profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of profiles
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /profiles/{userId}:
 *   get:
 *     summary: Get profile by user ID
 *     description: Retrieve profile information for a specific user
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get profile
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new profile
 *     description: Create profile for a user (can include avatar upload)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID associated with this profile
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: User's gender
 *               address:
 *                 type: string
 *                 description: Physical address
 *               bio:
 *                 type: string
 *                 description: User biography
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *           encoding:
 *             avatar:
 *               contentType: image/jpeg, image/png, image/gif
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       409:
 *         description: Profile already exists for this user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /profiles/{userId}:
 *   put:
 *     summary: Update existing profile
 *     description: Update user profile information (can include avatar update)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: User's gender
 *               address:
 *                 type: string
 *                 description: Physical address
 *               bio:
 *                 type: string
 *                 description: User biography
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *           encoding:
 *             avatar:
 *               contentType: image/jpeg, image/png, image/gif
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /profiles/{userId}:
 *   delete:
 *     summary: Delete profile by user ID
 *     description: Soft delete a user's profile from the system
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete profile
 *     responses:
 *       200:
 *         description: Profile soft deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */

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