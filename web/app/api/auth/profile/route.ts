import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH } from '@/lib';
import { ApiErrorCode, ApiErrorMessage, JwtPayload } from '@/types';
import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;

        if (!token) {
            return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
        }

        const decoded = verifyToken(token) as JwtPayload;
        if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
        const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

        const user = await UserService.getProfile(userId);
        return ApiResponse(user).success();
    } catch (error) {
        console.error("Profile error:", error);
        return ErrorException(
            ApiErrorMessage.AUTHENTICATION_ERROR.value,
            ApiErrorCode.AUTHENTICATION_ERROR.code
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
        if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

        const decoded = verifyToken(token) as JwtPayload;
        if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
        const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

        const body = await req.json();

        // Profiles are tied to the logged-in user, so we ignore body.id and use session userId
        const updated = await UserService.update(userId, body);

        return ApiResponse(updated).success();
    } catch (error) {
        console.error("Profile update error:", error);
        return ErrorException(
            ApiErrorMessage.AUTHENTICATION_ERROR.value,
            ApiErrorCode.AUTHENTICATION_ERROR.code
        );
    }
}

