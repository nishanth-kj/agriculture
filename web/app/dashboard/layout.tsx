'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, Lock, Leaf, FlaskConical, Sprout, Bug, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

interface SidebarContentProps {
    isCollapsed: boolean;
    pathname: string;
    user: any;
    logout: () => void;
    onItemClick?: () => void;
}

const SidebarContent = ({ isCollapsed, pathname, user, logout, onItemClick }: SidebarContentProps) => {
    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Managing', href: '/dashboard/managing', icon: Users },
        { name: 'Soil Health', href: '/dashboard/services/soil-health', icon: FlaskConical },
        { name: 'Crop Prediction', href: '/dashboard/services/crop-prediction', icon: Sprout },
        { name: 'Pest Prediction', href: '/dashboard/services/pest-prediction', icon: Bug },
    ];

    return (
        <div className="flex flex-col h-full bg-card text-card-foreground">
            {/* Header Section */}
            <div className={cn("px-6 py-8 flex flex-col", isCollapsed ? "items-center px-4" : "items-start")}>
                <div className="flex items-center gap-3">
                    <div className="bg-black dark:bg-primary p-2.5 rounded-xl text-white shadow-lg flex-shrink-0">
                        <Leaf className="w-5 h-5 fill-white/20" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-lg font-black tracking-tight text-foreground truncate">
                                {user?.name || 'Dashboard'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar no-scrollbar-on-collapse">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                                "flex items-center rounded-xl text-sm font-semibold transition-all h-11",
                                isCollapsed ? "justify-center px-0 mx-2" : "px-4 gap-3 mx-1",
                                "text-muted-foreground hover:bg-muted hover:text-foreground",
                                isActive && "bg-muted text-foreground font-bold"
                            )}
                            title={isCollapsed ? item.name : ""}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-border mt-auto">
                {user && !isCollapsed && (
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-sm">
                            {user.name?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-foreground truncate leading-tight">{user.name}</span>
                            <span className="text-[11px] text-muted-foreground truncate tracking-tight">{user.role || 'Member'}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center rounded-xl text-sm font-bold transition-all h-11 w-full text-destructive hover:bg-destructive/10",
                        isCollapsed ? "justify-center px-0" : "px-4 gap-3",
                    )}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <Lock className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">Sign Out</span>}
                </button>

                {!isCollapsed && (
                    <div className="mt-4 text-[9px] font-bold text-muted-foreground text-center tracking-widest uppercase">
                        AgriTech v2.0
                    </div>
                )}
            </div>
        </div>
    );
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        // Layout level effects
    }, [user]);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-64px)] py-5 pl-5 z-20">
                <aside className={cn(
                    "bg-card border border-border rounded-[32px] flex flex-col transition-all duration-500 ease-in-out relative shadow-sm overflow-hidden",
                    "h-[calc(100vh-140px)]",
                    isCollapsed ? "w-[76px]" : "w-[260px]"
                )}>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-12 bg-card border border-border rounded-full p-1.5 shadow-sm hover:bg-muted transition-all z-30 group"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        ) : (
                            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        )}
                    </button>

                    <SidebarContent
                        isCollapsed={isCollapsed}
                        pathname={pathname}
                        user={user}
                        logout={logout}
                    />
                </aside>
            </div>

            {/* Main Content Area */}
            <main
                className={cn(
                    "flex-1 overflow-auto flex flex-col pt-0 transition-all duration-500 ease-in-out",
                    isCollapsed ? "md:ml-[116px]" : "md:ml-[300px]" // Dynamic left margin
                )}
            >
                {/* Mobile Sidebar Toggle */}
                <div className="md:hidden">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                className="fixed left-0 top-24 z-40 rounded-r-xl rounded-l-none h-10 w-8 bg-black/90 dark:bg-primary/90 hover:bg-black dark:hover:bg-primary shadow-md transition-all duration-300 ease-in-out active:scale-95"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r border-border bg-card w-[280px]">
                            <SidebarContent
                                isCollapsed={false}
                                pathname={pathname}
                                user={user}
                                logout={logout}
                                onItemClick={() => setIsMobileOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Dynamically Injected Content */}
                <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
