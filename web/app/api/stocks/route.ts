import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH, STATUS } from '@/lib';
import { JwtPayload, ApiErrorCode, ApiErrorMessage, Pagination } from '@/types';
import { NextRequest } from 'next/server';
import { StockService } from '@/services/stock.service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

    const body = await req.json();

    // 1. Pagination Logic (Detected by presence of page and size)
    if (body.page !== undefined && body.size !== undefined) {
      const pagination: Pagination = {
        page: Number(body.page),
        size: Number(body.size),
        total: 0,
        totalPages: 0
      };
      const stocks = await StockService.listPaginated(userId, pagination);
      return ApiResponse(stocks).success();
    }

    // 2. Unified Upsert/Delete Logic (Detected by presence of id)
    if (body.id) {
      const id = typeof body.id === 'string' ? parseInt(body.id) : body.id;

      // Soft Delete if status is 0
      if (body.status === 0 || body.status === STATUS.INACTIVE.code) {
        const deleted = await StockService.delete(id);
        return ApiResponse(deleted).success();
      }

      // Update existing record
      const updated = await StockService.update(id, {
        ...body,
        userId: userId
      });
      return ApiResponse(updated).success();
    }

    // 3. Create new record if no ID or Pagination params are provided
    const stock = await StockService.create({
      ...body,
      userId: userId
    });
    return ApiResponse(stock).success();
  } catch (error) {
    console.error('Error in POST /api/stocks:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

    const stocks = await StockService.findByUserId(userId);
    return ApiResponse(stocks).success();
  } catch (error) {
    console.error('Error in GET /api/stocks:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

