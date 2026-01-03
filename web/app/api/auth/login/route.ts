import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ status: 0, message: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ status: 0, message: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ status: 0, message: "Invalid credentials" }, { status: 401 });
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            status: 1,
            message: "Login successful",
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
        console.error("Login error:", error);
        return NextResponse.json({ status: 0, message: "Internal server error" }, { status: 500 });
    }
}
