import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

interface JwtPayload { id: string; }

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ status: 0, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded?.id) return NextResponse.json({ status: 0, message: 'Invalid token', error: 'Invalid token' }, { status: 401 });

  const record = await prisma.soilData.findFirst({ where: { userId: decoded.id } });
  return NextResponse.json({ status: 1, message: 'Success', data: record || null });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ status: 0, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded?.id) return NextResponse.json({ status: 0, message: 'Invalid token', error: 'Invalid token' }, { status: 401 });

  const body = await req.json();
  const { N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B } = body;

  const values = [N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B];
  if (values.some(val => val === undefined || isNaN(val))) {
    return NextResponse.json({ status: 0, message: 'Missing or invalid soil data', error: 'Missing or invalid soil data' }, { status: 400 });
  }

  try {
    // Call Python API to get prediction
    const pythonApiUrl = process.env.API_URL || 'https://agriculture-j9bi.onrender.com';
    const response = await fetch(`${pythonApiUrl}/api/soil/predict/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({
        status: 0,
        message: 'Python API error',
        error: errorData.message || 'Failed to get prediction'
      }, { status: response.status });
    }

    const prediction = await response.json();
    const { fertility_class, confidence } = prediction.data || prediction;

    // Save to database
    const record = await prisma.soilData.create({
      data: {
        userId: decoded.id,
        N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B,
        fertilityClass: fertility_class,
        confidence
      }
    });

    return NextResponse.json({
      status: 1,
      message: 'Prediction successful',
      data: {
        ...record,
        fertility_class,
        confidence
      }
    });
  } catch (error: any) {
    console.error('Error calling Python API:', error);
    return NextResponse.json({
      status: 0,
      message: 'Server error',
      error: error.message || 'Failed to process request'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ status: 0, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as JwtPayload;
  if (!decoded?.id) return NextResponse.json({ status: 0, message: 'Invalid token', error: 'Invalid token' }, { status: 401 });

  const body = await req.json();
  const { N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B } = body;

  const values = [N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B];
  if (values.some(val => val === undefined || isNaN(val))) {
    return NextResponse.json({ status: 0, message: 'Missing or invalid soil data', error: 'Missing or invalid soil data' }, { status: 400 });
  }

  const existing = await prisma.soilData.findFirst({ where: { userId: decoded.id } });
  if (!existing) return NextResponse.json({ status: 0, message: 'Record not found', error: 'Record not found' }, { status: 404 });

  try {
    // Call Python API to get fresh prediction
    const pythonApiUrl = process.env.API_URL || 'https://agriculture-j9bi.onrender.com';
    const response = await fetch(`${pythonApiUrl}/api/soil/predict/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({
        status: 0,
        message: 'Python API error',
        error: errorData.message || 'Failed to get prediction'
      }, { status: response.status });
    }

    const prediction = await response.json();
    const { fertility_class, confidence } = prediction.data || prediction;

    // Update database
    const record = await prisma.soilData.update({
      where: { id: existing.id },
      data: {
        N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B,
        fertilityClass: fertility_class,
        confidence
      }
    });

    return NextResponse.json({
      status: 1,
      message: 'Prediction updated',
      data: {
        ...record,
        fertility_class,
        confidence
      }
    });
  } catch (error: any) {
    console.error('Error calling Python API:', error);
    return NextResponse.json({
      status: 0,
      message: 'Server error',
      error: error.message || 'Failed to process request'
    }, { status: 500 });
  }
}
