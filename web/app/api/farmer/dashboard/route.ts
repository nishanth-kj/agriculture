import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH } from '@/lib';
import { ApiErrorCode, ApiErrorMessage, JwtPayload } from '@/types';
import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';

/**
 * POST /api/farmer
 * Returns farmer-specific dashboard statistics.
 * Requires FARMER role.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;
    const profile = await UserService.getProfile(userId);

    if (profile.role !== 'FARMER') {
      return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
    }

    const stats = await UserService.getDashboardStats('FARMER', userId);
    return ApiResponse(stats).success();
  } catch (error) {
    console.error('Farmer dashboard error:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}
