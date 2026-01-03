'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                if (res.data.status === 1) {
                    setUser(res.data.data);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const res = await axios.post('/api/auth/login', credentials);
            if (res.data.status === 1) {
                setUser(res.data.data);
                router.push('/dashboard'); // or wherever
            }
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Login failed');
        }
    };

    const register = async (data: any) => {
        try {
            const res = await axios.post('/api/auth/register', data);
            if (res.data.status === 1) {
                setUser(res.data.data);
                router.push('/dashboard');
            }
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await axios.delete('/api/auth/me');
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
