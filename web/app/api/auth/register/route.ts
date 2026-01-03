import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, role } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ status: 0, message: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ status: 0, message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'FARMER',
            },
        });

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            status: 1,
            message: "Registration successful",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

        // Set token in a httpOnly cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ status: 0, message: "Internal server error" }, { status: 500 });
    }
}
