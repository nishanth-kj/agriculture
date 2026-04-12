import { ApiResponse, ErrorException } from '@/lib/server';
import { AUTH } from '@/lib';
import { ApiErrorCode, ApiErrorMessage } from '@/types';
import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Support identification via 'email' (legacy/frontend) or 'username' or 'identifier'
    const identifier = body.email || body.username || body.identifier;
    const { password } = body;

    if (!identifier || !password) {
      return ApiResponse(ApiErrorCode.MISSING_FIELDS).error();
    }

    const { user, token } = await UserService.login(identifier, password);

    const response = ApiResponse(user).success();

    // Set secure auth cookie
    response.cookies.set(AUTH.COOKIE.NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === AUTH.COOKIE.SECURE_ENV,
      sameSite: AUTH.COOKIE.SAME_SITE as 'lax' | 'strict' | 'none',
      maxAge: AUTH.COOKIE.MAX_AGE,
      path: AUTH.COOKIE.PATH,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return ErrorException(
      ApiErrorMessage.AUTHENTICATION_ERROR.value,
      ApiErrorCode.AUTHENTICATION_ERROR.code
    );
  }
}

