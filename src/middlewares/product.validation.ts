import { Request, Response, NextFunction } from 'express';
import { body, param, ValidationChain, validationResult } from 'express-validator';
import { errorResponse } from '../utils/response';


export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
};

export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name must be provided')
    .isLength({ min: 3 }).withMessage('product name must be at least 3 characters long'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description must be provided'),
  
  body('price')
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value > 0).withMessage('Price must be greater than zero'),
  
  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID must be a number')
];
