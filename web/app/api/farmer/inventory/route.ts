import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH } from '@/lib';
import { JwtPayload, ApiErrorCode, ApiErrorMessage } from '@/types';
import { NextRequest } from 'next/server';
import { StockService } from '@/services/stock.service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const body = await req.json();

    // 1. Pagination Logic (Standardized Parameters)
    if (body.pageNumber !== undefined && body.size !== undefined) {
      const results = await StockService.listPaginated(decoded.id, {
        pageNumber: Number(body.pageNumber),
        size: Number(body.size),
        sortBy: body.sortBy,
        sortOrder: body.sortOrder
      });
      return ApiResponse(results).success();
    }

    // 2. Delete Logic
    if (body.id) {
      const result = await StockService.delete(Number(body.id));
      return ApiResponse(result).success();
    }

    // 3. Create Logic
    const result = await StockService.create({
      name: body.name,
      quantity: body.quantity,
      location: body.location,
      cost: body.cost || 0,
      sellingPrice: body.sellingPrice || 0,
      userId: decoded.id
    });

    return ApiResponse(result).success();
  } catch (error) {
    console.error('Error in POST /api/farmer/inventory:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}
