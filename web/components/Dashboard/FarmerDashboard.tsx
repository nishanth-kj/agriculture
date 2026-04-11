'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
    FaMoneyBillWave, FaBox, FaUsers, FaArrowUp, 
    FaSeedling, FaTractor, FaCloudSun, FaChartLine 
} from 'react-icons/fa';

import { FarmerDashboardProps } from '@/types';

export const FarmerDashboard = ({ stats }: FarmerDashboardProps) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-1.5 bg-emerald-600 rounded-full" />
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Farm Prosperity</h1>
                        <p className="text-muted-foreground font-medium">Performance metrics and resource allocation for your operations.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profit/Financial Main Card */}
                <Card className="md:col-span-2 p-8 bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-none">
                    <div className="absolute right-0 top-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <FaMoneyBillWave size={200} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-emerald-100/70 text-sm font-bold uppercase tracking-widest mb-2">Net Farm Valuation</p>
                            <h2 className="text-6xl font-black font-mono">₹{stats.revenue.toLocaleString()}</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                                <p className="text-xs font-bold text-emerald-100 uppercase mb-1">Operational Cost</p>
                                <p className="text-2xl font-black">₹{stats.cost.toLocaleString()}</p>
                            </div>
                            <div className="bg-emerald-400 p-6 rounded-3xl shadow-xl shadow-emerald-500/20 text-emerald-950">
                                <p className="text-xs font-bold uppercase mb-1">Net Profit</p>
                                <p className="text-2xl font-black">₹{stats.profit.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Insights Column */}
                <div className="space-y-6">
                    <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-xl rounded-[2rem] flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Assets</p>
                            <p className="text-3xl font-black">{stats.inventoryCount}</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600">
                            <FaBox size={30} />
                        </div>
                    </Card>

                    <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-xl rounded-[2rem] flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Workforce</p>
                            <p className="text-3xl font-black">{stats.labourCount}</p>
                        </div>
                        <div className="p-4 bg-sky-500/10 rounded-2xl text-sky-600">
                            <FaUsers size={30} />
                        </div>
                    </Card>

                    <Card className="p-6 bg-emerald-600 text-white shadow-xl rounded-[2rem] flex items-center justify-between overflow-hidden relative">
                         <div className="absolute right-0 bottom-0 opacity-10 -rotate-12">
                            <FaArrowUp size={80} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-100 uppercase mb-1">Growth Index</p>
                            <p className="text-3xl font-black">+14.2%</p>
                        </div>
                        <FaChartLine size={30} />
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities Hook */}
                <Card className="p-8 bg-card/40 backdrop-blur-xl border-border shadow-xl rounded-[2.5rem]">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                        <FaSeedling className="text-emerald-500" /> Operational Health
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Soil Analysis', status: 'Optimal', color: 'text-emerald-500' },
                            { label: 'Inventory Level', status: 'Sufficient', color: 'text-sky-500' },
                            { label: 'Labour Assigned', status: 'Full Capacity', color: 'text-amber-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border">
                                <span className="font-bold">{item.label}</span>
                                <span className={`font-black text-sm uppercase ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Automation Quick Links */}
                <Card className="p-8 bg-slate-900 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
                     <div className="absolute right-0 bottom-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                        <FaTractor size={200} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6">Automation Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 text-white transition-all text-left group/btn">
                            <FaCloudSun className="mb-3 text-sky-400 group-hover/btn:scale-110 transition-transform" />
                            <p className="font-bold text-sm">Weather Forecast</p>
                        </button>
                        <button className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 text-white transition-all text-left group/btn">
                            <FaSeedling className="mb-3 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                            <p className="font-bold text-sm">Crop Plan</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
