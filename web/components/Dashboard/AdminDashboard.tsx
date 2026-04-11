'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
    FaUsers, FaShieldAlt, FaChartBar, FaServer, 
    FaUserSecret, FaGlobe 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import { AdminDashboardProps, RoleStat } from '@/types';


export const AdminDashboard = ({ stats }: AdminDashboardProps) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-slate-950 rounded-full" />
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-950">System Command</h1>
                    <p className="text-slate-500 font-medium">Enterprise-level overview of users, security, and global assets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <Card className="p-6 bg-slate-900 text-white rounded-[2rem] border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                        <FaUsers size={140} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Authenticated Users</p>
                    <h3 className="text-4xl font-black">{stats.totalUsers}</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        System Sync Active
                    </div>
                </Card>

                {/* Valuation */}
                <Card className="p-6 bg-white/40 backdrop-blur-xl border-slate-200 shadow-xl rounded-[2rem] relative group">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Resource Value</p>
                    <h3 className="text-4xl font-black text-slate-900 font-mono">₹{stats.totalValuation.toLocaleString()}</h3>
                    <p className="mt-4 text-xs text-slate-400 font-medium italic">Aggregated across all registered farms</p>
                </Card>

                {/* System Status */}
                <Card className="p-6 bg-white/40 backdrop-blur-xl border-slate-200 shadow-xl rounded-[2rem]">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Core API Status</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-4xl font-black text-emerald-600">{stats.systemStatus}</h3>
                        <FaServer className="text-slate-300" size={24} />
                    </div>
                    <div className="mt-4 flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 flex-1 bg-emerald-500/20 rounded-full" />)}
                    </div>
                </Card>

                {/* Security */}
                <Card className="p-6 bg-amber-500 text-white rounded-[2rem] shadow-xl relative overflow-hidden group">
                     <div className="absolute -right-2 -bottom-2 opacity-20">
                        <FaShieldAlt size={100} />
                    </div>
                    <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-2">Security Tier</p>
                    <h3 className="text-4xl font-black">Level 4</h3>
                    <p className="mt-4 text-xs font-bold text-amber-900/50">RBAC ACTIVE</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Role Distribution */}
                <Card className="lg:col-span-12 p-8 bg-white/60 backdrop-blur-2xl border-slate-200/50 shadow-2xl rounded-[2.5rem]">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <FaUsers className="text-slate-400" /> User Ecosystem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.roleDistribution.map((role: RoleStat) => (
                            <motion.div 
                                key={role.name}
                                whileHover={{ y: -5 }}
                                className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col items-center text-center group"
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    {role.name === 'ADMIN' && <FaUserSecret size={24} />}
                                    {role.name === 'FARMER' && <FaGlobe size={24} />}
                                    {role.name === 'WORKER' && <FaChartBar size={24} />}
                                </div>
                                <p className="text-xs font-black text-slate-400 uppercase mb-1">{role.name}</p>
                                <p className="text-3xl font-black text-slate-900">{role.count}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
