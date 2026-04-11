'use client';

import { api, ROLE } from '@/lib';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { FarmerDashboard } from '@/components/Dashboard/FarmerDashboard';
import { WorkerDashboard } from '@/components/Dashboard/WorkerDashboard';
import LoginRequired from '@/components/LoginRequired/LoginRequired';
import { AdminDashboardProps, FarmerDashboardProps, WorkerDashboardProps } from '@/types';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            await api('/api/auth/me').post(); // Ensure session is fresh
            // In a real app, I'd have a specific /api/dashboard/stats endpoint
            // BUT for this refactor, I'll leverage the UserService.getDashboardStats logic
            // which I'll expose via a new /api/dashboard/stats route.
            const dashboardData = await api('/api/dashboard/stats').post();
            setStats(dashboardData);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            // Fallback for demo if route not yet active
            setStats({});
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
        <div className="h-[80vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
        </div>
    );

    if (!user) return <LoginRequired />;

    if (loading || !stats) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="h-12 w-12 bg-muted rounded-2xl" />
            <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">Synchronizing Encrypted Data...</p>
        </div>
    );

    return (
        <div className="max-w-screen-xl mx-auto p-6 min-h-screen">
            {user.role === ROLE.ADMIN.code && <AdminDashboard stats={stats as AdminDashboardProps['stats']} />}
            {user.role === ROLE.FARMER.code && <FarmerDashboard stats={stats as FarmerDashboardProps['stats']} />}
            {user.role === ROLE.WORKER.code && <WorkerDashboard stats={stats as WorkerDashboardProps['stats']} />}

            {/* Fallback if role is undefined or mismatch */}
            {!Object.values(ROLE).some(r => r.code === user.role) && (
                <Card className="p-12 text-center bg-red-50 border-red-100 rounded-[2.5rem]">
                    <h2 className="text-2xl font-black text-red-600 mb-2">Undefined Access Tier</h2>
                    <p className="text-red-400 font-medium">Your account role ({user.role}) is not recognized by the central authority.</p>
                </Card>
            )}
        </div>
    );
}

