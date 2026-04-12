'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [isWorker, setIsWorker] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }

    const identityValue = form.email.trim();
    if (isWorker) {
      if (identityValue.includes('@') || identityValue.length < 3) {
        toast.error('Please enter a valid worker username')
        return
      }
    } else {
      if (!identityValue.includes('@') || !/^\S+@\S+\.\S+$/.test(identityValue)) {
        toast.error('Please provide a valid email address')
        return
      }
    }

    setLoading(true)
    try {
      await login({ ...form });
      toast.success('Login successful')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold text-center">Login</h2>
          
          <div className="space-y-2">
            <Label>{isWorker ? 'Username' : 'Email'}</Label>
            <Input 
              name="email" 
              type={isWorker ? 'text' : 'email'} 
              placeholder={isWorker ? 'username' : 'email@example.com'} 
              onChange={handleChange} 
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="worker-toggle" 
              checked={isWorker}
              onCheckedChange={(checked) => setIsWorker(checked as boolean)}
            />
            <Label htmlFor="worker-toggle" className="text-sm cursor-pointer">
              Operator/Worker Login
            </Label>
          </div>

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
