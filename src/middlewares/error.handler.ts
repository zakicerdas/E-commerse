import type { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../utils/env';
import { Prisma } from '#generated/client';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('ERROR:', err);

  if (res.headersSent) {
    return;
  }

  // Prisma errors dulu
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Data sudah ada (Unique constraint violation)',
        field: err.meta?.target,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan',
      });
    }
  }

  const statusCode = err.message?.includes('tidak ditemukan') ? 404 : 400;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan server',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
};