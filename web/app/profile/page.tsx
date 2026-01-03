'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { FaUser, FaHistory, FaCog, FaLeaf } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Not logged in");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Header */}
        <Card className="border-none shadow-md bg-white dark:bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-green-100 dark:border-green-900/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-green-600 text-white text-3xl font-bold">
                {user?.name ? user.name[0].toUpperCase() : <FaUser />}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2 mb-4">
                <FaUser className="text-sm" /> {user?.email}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                  Confirmed User
                </Badge>
                <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400 uppercase">
                  {user?.role || 'Farmer'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="hidden sm:flex" onClick={() => toast("Edit Profile coming soon!")}>
              <FaCog className="mr-2" /> Settings
            </Button>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Activity / Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaHistory className="text-blue-500" /> Recent Activity
              </CardTitle>
              <CardDescription>Your latest interactions with the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                    <FaLeaf size={14} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Crop Prediction Ran</h4>
                    <p className="text-xs text-gray-500">2 hours ago • Success</p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500 py-4">
                  No more recent activity found.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUser className="text-purple-500" /> Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-sm text-gray-500">Plan</span>
                <span className="font-medium text-green-600">Free Tier</span>
              </div>
              <div className="mt-4">
                <Button className="w-full" variant="secondary" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
