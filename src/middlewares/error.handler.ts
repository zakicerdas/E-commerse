import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { NODE_ENV } from '../utils/env';
import { Prisma } from '#generated/client';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (res.headersSent) return;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return errorResponse(
        res,
        'Data sudah ada (Unique constraint violation)',
        409,
        err.meta?.target ? [{ field: String(err.meta.target), message: 'Already exists' }] : null
      );
    }

    if (err.code === 'P2025') {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
  }

  return errorResponse(
    res,
    err.message || 'Terjadi kesalahan server',
    400,
    NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};