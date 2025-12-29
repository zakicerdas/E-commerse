import type { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';


export const register = asyncHandler(
  async (req: Request, res: Response) => {
    console.log('REQ BODY:', req.body);
    const user = await AuthService.register(req.body);
    return successResponse(
      res,
      'Register berhasil',
      user,
      null,
      201
    );
  }

  
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    return successResponse(
      res,
      'Login berhasil',
      result
    );
  }
);


