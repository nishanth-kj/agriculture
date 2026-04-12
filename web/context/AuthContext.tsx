'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api/apiclient';
import { useRouter } from 'next/navigation';
import { RegisterPayload, LoginPayload } from '@/types';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await api('api/auth/me').post();
                if (res?.data) {
                    setUser(res.data as User);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (credentials: Record<string, unknown>) => {
        try {
            const res = await api('api/auth/login', credentials).post();
            if (res?.data) {
                const userObj = res.data as User;
                setUser(userObj);
                const rolePath = String(userObj.role || 'dashboard').toLowerCase();
                router.push(`/dashboard/${rolePath}`);
            }
        } catch (err: unknown) {
            throw new Error((err as Error).message || 'Login failed');
        }
    };

    const register = async (data: RegisterPayload) => {
        try {
            const res = await api('/api/auth/register', data).post();
            if (res?.data) {
                const userObj = res.data as User;
                setUser(userObj);
                const rolePath = String(userObj.role || 'dashboard').toLowerCase();
                router.push(`/dashboard/${rolePath}`);
            }
        } catch (err: unknown) {
            throw new Error((err as Error).message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api('/api/auth/logout').post();
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login: login as (credentials: unknown) => Promise<void>, register : register as (data: RegisterPayload) => Promise<void>, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
