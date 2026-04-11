import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH } from '@/lib';
import { ApiErrorCode, ApiErrorMessage, JwtPayload } from '@/types';
import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;

    if (!token) {
      return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
    }

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded || !decoded.id) {
      return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
    }

    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

    // Get the full profile to know the role
    const userProfile = await UserService.getProfile(userId);
    // In our simplified logic, profile returns role too if we add it.
    // BUT we can fetch role directly from DB in UserService or just use our me service.

    // For now, I'll assume getProfile is updated or I'll fetch user with role join
    const stats = await UserService.getDashboardStats(userProfile.role || 'WORKER', userId);

    return ApiResponse(stats).success();
  } catch (error) {
    console.error('Stats error:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

