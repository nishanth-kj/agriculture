import { ApiResponse, ErrorException } from '@/lib/server';
import { AUTH } from '@/lib';
import { ApiErrorCode, ApiErrorMessage } from '@/types';
import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, username } = await req.json();

    if (!email || !password || !name) {
      return ApiResponse(ApiErrorCode.MISSING_FIELDS).error();
    }

    const { user, token } = await UserService.register({
      email,
      password,
      name,
      username
    });

    const response = ApiResponse(user).success();

    // Use centralized constants for security and configuration
    response.cookies.set(AUTH.COOKIE.NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === AUTH.COOKIE.SECURE_ENV,
      sameSite: AUTH.COOKIE.SAME_SITE as 'lax' | 'strict' | 'none',
      maxAge: AUTH.COOKIE.MAX_AGE,
      path: AUTH.COOKIE.PATH,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

