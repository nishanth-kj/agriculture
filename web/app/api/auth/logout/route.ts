import { ApiResponse } from '@/lib/server';
import { AUTH } from '@/lib';

export async function POST() {
  const response = ApiResponse(null).success();

  response.cookies.set(AUTH.COOKIE.NAME, '', {
    maxAge: 0,
    path: AUTH.COOKIE.PATH,
  });

  return response;
}

