import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ status: 0, message: "Not authenticated" }, { status: 401 });
        }

        const decoded: any = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            }
        });

        if (!user) {
            return NextResponse.json({ status: 0, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: 1,
            user: user // Added this to match expected frontend format
        });

    } catch (error) {
        return NextResponse.json({ status: 0, message: "Invalid session" }, { status: 401 });
    }
}
