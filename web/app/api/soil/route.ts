import { verifyToken, ApiResponse, ErrorException } from '@/lib/server';
import { AUTH, STATUS } from '@/lib';
import { JwtPayload, ApiErrorCode, ApiErrorMessage } from '@/types';
import { NextRequest } from 'next/server';
import { SoilService } from '@/services/soil.service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

    const body = await req.json();

    // Unified Upsert/Delete Logic
    if (body.id) {
      // Soft Delete if status is 0
      if (body.status === 0 || body.status === STATUS.INACTIVE.code) {
        const deleted = await SoilService.updateAndPredict(userId, {
          ...body,
          status: STATUS.INACTIVE.code
        });
        return ApiResponse(deleted).success();
      }

      // Update: Perform prediction and update existing record
      const record = await SoilService.updateAndPredict(userId, body);
      return ApiResponse(record).success();
    }

    // Create: Predict and save new record
    const record = await SoilService.predictAndSave(userId, body);
    return ApiResponse(record).success();
  } catch (error) {
    console.error('Error in POST /api/soil:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH.COOKIE.NAME)?.value;
    if (!token) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.id) return ApiResponse(ApiErrorCode.UNAUTHORIZED).error();
    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;

    const record = await SoilService.findLatestByUserId(userId);
    return ApiResponse(record).success();
  } catch (error) {
    console.error('Error in GET /api/soil:', error);
    return ErrorException(
      ApiErrorMessage.INTERNAL_SERVER_ERROR.value,
      ApiErrorCode.INTERNAL_SERVER_ERROR.code
    );
  }
}

