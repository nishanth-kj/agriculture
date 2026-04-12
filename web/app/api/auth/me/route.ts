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
    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

    if (!userId) {
      return ApiResponse(ApiErrorCode.AUTHENTICATION_ERROR).error();
    }

    const user = await UserService.getProfile(userId);

    return ApiResponse(user).success();
  } catch (error) {
    console.error('Session error:', error);
    return ErrorException(
      ApiErrorMessage.AUTHENTICATION_ERROR.value,
      ApiErrorCode.AUTHENTICATION_ERROR.code
    );
  }
}

