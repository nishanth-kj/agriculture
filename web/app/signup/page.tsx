'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || 'Sign up failed')
      return
    }

    toast.success('Account created! Logging in...')

    // Auto-login after signup
    const loginRes = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    })

    if (!loginRes?.error) {
      router.push('/dashboard')
    } else {
      toast.error('Login failed after signup')
      router.push('/login')
    }
  }



  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold text-center">Sign Up</h2>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" onChange={handleChange} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Sign Up
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
