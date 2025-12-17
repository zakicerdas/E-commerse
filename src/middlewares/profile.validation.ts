import { body, param, validationResult, type ValidationChain } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map((err: any) => ({
      field: err.path || err.param || 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
};

export const createProfileValidation = [
  body('userId')
    .notEmpty().withMessage('User ID wajib diisi'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Gender harus male, female, atau other'),
  body('address')
    .optional()
    .isLength({ min: 5 }).withMessage('Alamat minimal 5 karakter'),
  body('bio')
    .optional()
    .isLength({ max: 500 }).withMessage('Bio maksimal 500 karakter'),
  body('avatarUrl')
    .optional()
    .isURL().withMessage('Avatar harus URL valid'),
];

export const updateProfileValidation = [
  param('userId')
    .notEmpty().withMessage('User ID harus diisi'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Gender harus male, female, atau other'),
  body('address')
    .optional()
    .isLength({ min: 5 }).withMessage('Alamat minimal 5 karakter'),
  body('bio')
    .optional()
    .isLength({ max: 500 }).withMessage('Bio maksimal 500 karakter'),
  body('avatarUrl')
    .optional()
    .isURL().withMessage('Avatar harus URL valid'),
];

export const getProfileValidation = [
  param('userId')
    .notEmpty().withMessage('User ID harus diisi'),
];