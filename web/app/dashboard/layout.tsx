'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, Lock, Leaf, FlaskConical, Sprout, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        // Layout level effects
    }, [user]);

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Managing', href: '/dashboard/managing', icon: Users },
        { name: 'Soil Health', href: '/dashboard/services/soil-health', icon: FlaskConical },
        { name: 'Crop Prediction', href: '/dashboard/services/crop-prediction', icon: Sprout },
        { name: 'Pest Prediction', href: '/dashboard/services/pest-prediction', icon: Bug },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar Container */}
            <div className="hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-64px)] py-5 pl-5 z-20">
                <aside className={cn(
                    "bg-white border border-slate-200 rounded-[32px] flex flex-col transition-all duration-500 ease-in-out relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden",
                    "h-[calc(100vh-140px)]",
                    isCollapsed ? "w-[76px]" : "w-[260px]"
                )}>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-12 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm hover:bg-slate-50 transition-all z-30 group"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        ) : (
                            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        )}
                    </button>

                    {/* Scrollable Container for everything */}
                    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar no-scrollbar-on-collapse">
                        {/* Header Section */}
                        <div className={cn("px-6 py-8 flex flex-col", isCollapsed ? "items-center px-4" : "items-start")}>
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100 flex-shrink-0">
                                    <Leaf className="w-5 h-5 fill-white/20" />
                                </div>
                                {!isCollapsed && (
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-lg font-black tracking-tight text-slate-900 truncate">
                                            {user?.name || 'Dashboard'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-1 px-3 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center rounded-xl text-sm font-semibold transition-all h-11",
                                            isCollapsed ? "justify-center px-0 mx-2" : "px-4 gap-3 mx-1",
                                            "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                            isActive && "text-slate-900"
                                        )}
                                        title={isCollapsed ? item.name : ""}
                                    >
                                        <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-emerald-600" : "text-slate-400")} />
                                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Profile & Logout - Moved inside the scrollable area */}
                        <div className="p-4 bg-[#fafafa]/50 border-t border-slate-100">
                            {user && !isCollapsed && (
                                <div className="flex items-center gap-3 px-2 mb-4">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-bold text-slate-800 truncate leading-tight">{user.name}</span>
                                        <span className="text-[11px] text-slate-400 truncate tracking-tight">{user.role || 'Member'}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={logout}
                                className={cn(
                                    "flex items-center rounded-xl text-sm font-bold transition-all h-11 w-full text-rose-500 hover:bg-rose-50",
                                    isCollapsed ? "justify-center px-0" : "px-4 gap-3",
                                )}
                                title={isCollapsed ? "Logout" : ""}
                            >
                                <Lock className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span className="truncate">Sign Out</span>}
                            </button>

                            {!isCollapsed && (
                                <div className="mt-4 text-[9px] font-bold text-slate-300 text-center tracking-widest uppercase">
                                    AgriTech v2.0
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Main Content Area */}
            <main
                className={cn(
                    "flex-1 overflow-auto flex flex-col pt-4 md:pt-0 transition-all duration-500 ease-in-out",
                    isCollapsed ? "md:ml-[116px]" : "md:ml-[300px]" // Dynamic left margin: (20px pad + width + 20px gap)
                )}
            >
                {/* Mobile Navigation Bar */}
                <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-2 flex items-center justify-between sticky top-16 z-10 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <span className="text-slate-900 font-black text-lg tracking-tight truncate max-w-[150px]">
                            {user?.name || 'AgriTech'}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-slate-50 text-slate-500 rounded-xl">
                        <LayoutDashboard className="w-5 h-5" />
                    </Button>
                </div>

                {/* Dynamically Injected Content */}
                <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
