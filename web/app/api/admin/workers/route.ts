import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH, STATUS } from '@/lib';
import { JwtPayload, ApiErrorCode, ApiErrorMessage } from '@/types';
import { NextRequest } from 'next/server';
import { WorkerService } from '@/services/worker.service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const body = await req.json();

    // 1. Pagination Logic (Standardized Parameters)
    // Using the user's preferred ApiResponse helper which nests the service result in 'data'
    if (body.pageNumber !== undefined && body.size !== undefined) {
      const results = await WorkerService.listPaginated({
        pageNumber: Number(body.pageNumber),
        size: Number(body.size),
        sortBy: body.sortBy,
        sortOrder: body.sortOrder
      });
      return ApiResponse(results).success();
    }

    // 2. Delete Logic
    if (body.id && (body.status === 0 || body.status === STATUS.INACTIVE)) {
      const id = typeof body.id === 'string' ? parseInt(body.id) : body.id;
      const result = await WorkerService.delete(id);
      return ApiResponse(result).success();
    }

    // 3. Create Logic
    const result = await WorkerService.create({
      name: body.name,
      email: body.email,
      username: body.username,
      password: body.password,
      farm: body.farm,
      role: body.role,
      recruiterId: decoded.id
    });

    return ApiResponse(result).success();
  } catch (error) {
    console.error('Error in POST /api/admin/workers:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}
