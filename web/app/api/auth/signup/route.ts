// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })

    // User created successfully
    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
