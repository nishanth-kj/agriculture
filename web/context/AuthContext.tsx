'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api/apiclient';
import { useRouter } from 'next/navigation';

import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await api('/api/auth/me').post();
                if (data) {
                    setUser(data as User);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (credentials: unknown) => {
        try {
            const data = await api('/api/auth/login', credentials).post();
            if (data) {
                setUser(data as User);
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            throw new Error((err as Error).message || 'Login failed');
        }
    };

    const register = async (data: unknown) => {
        try {
            const resData = await api('/api/auth/register', data).post();
            if (resData) {
                setUser(resData as User);
                router.push('/dashboard');
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
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
