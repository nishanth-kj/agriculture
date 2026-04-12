import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH, STATUS } from '@/lib';
import { JwtPayload, ApiErrorCode, ApiErrorMessage, Pagination } from '@/types';
import { NextRequest } from 'next/server';
import { WorkerService } from '@/services/worker.service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    // Authorization check (Optional: Only FARMER or ADMIN can manage workers)
    // For now, any logged in user can access

    const body = await req.json();

    // 1. Pagination Logic
    if (body.page !== undefined && body.size !== undefined) {
      const pagination: Pagination = {
        page: Number(body.page),
        size: Number(body.size),
        total: 0,
        totalPages: 0
      };
      const workers = await WorkerService.listPaginated(pagination);
      return ApiResponse(workers).success();
    }

    // 2. Delete Logic
    if (body.id && (body.status === 0 || body.status === STATUS.INACTIVE)) {
      const id = typeof body.id === 'string' ? parseInt(body.id) : body.id;
      const result = await WorkerService.delete(id);
      return ApiResponse(result).success();
    }

    // 3. Create Logic (Automated User Creation included in Service)
    const result = await WorkerService.create({
      name: body.name,
      email: body.email,
      username: body.username,
      farm: body.farm,
      role: body.role
    });

    return ApiResponse(result).success();
  } catch (error) {
    console.error('Error in POST /api/workers:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

