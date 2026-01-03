'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { toast } from "react-hot-toast";

import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Not logged in");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold text-gray-800">{user?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </CardContent>
      </Card>
    </div>
  );
}
