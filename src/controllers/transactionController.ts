import type { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";
import { asyncHandler } from "../utils/async.handler";
import { successResponse, errorResponse } from "../utils/response";

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { userId, items } = req.body;
  
  // Validasi input
  if (!userId) {
    return errorResponse(res, 'userId wajib diisi', 400);
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return errorResponse(res, 'items wajib berupa array tidak kosong', 400);
  }
  
  const result = await transactionService.checkout(userId, items);
  return successResponse(res, 'Checkout berhasil', result, null, 201);
});

export const getDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    return errorResponse(res, 'ID transaksi wajib diisi', 400);
  }
  
  const result = await transactionService.getTransactionById(String(id));
  
  if (!result) {
    return errorResponse(res, 'Transaksi tidak ditemukan', 404);
  }
  
  return successResponse(res, 'Detail transaksi ditemukan', result);
});

export const getAllTransactions = asyncHandler(async (_req: Request, res: Response) => {

const transactions = await transactionService.getAllTransactions();
return successResponse(res, 'Daftar transaksi', transactions);
});