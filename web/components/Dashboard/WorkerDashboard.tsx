'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
    FaTasks, FaIdCard, FaCheckCircle, FaExclamationTriangle, 
    FaBriefcase, FaUserShield, FaFlask, FaMapMarkedAlt 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import { WorkerDashboardProps } from '@/types';

export const WorkerDashboard = ({ stats }: WorkerDashboardProps) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-1.5 bg-sky-600 rounded-full" />
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Field Operations</h1>
                        <p className="text-muted-foreground font-medium">Your active mission, task status, and operational toolkit.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Identity Card */}
                 <Card className="p-8 bg-sky-600 text-white rounded-[2.5rem] shadow-2xl col-span-1 md:col-span-2 relative overflow-hidden group border-none">
                    <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <FaIdCard size={150} />
                    </div>
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
                            <FaBriefcase size={32} />
                        </div>
                        <span className="px-4 py-1.5 bg-sky-400/30 rounded-full text-xs font-black uppercase tracking-widest border border-sky-400/50">
                            Active Duty
                        </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sky-100 text-xs font-bold uppercase tracking-widest">Designation</p>
                        <h2 className="text-4xl font-black">{stats.role}</h2>
                        <p className="text-sky-200 font-medium">Assigned to: <span className="text-white font-black">{stats.assignedFarm}</span></p>
                    </div>
                </Card>

                {/* Productivity Widget */}
                <Card className="p-8 bg-white/40 backdrop-blur-xl border-sky-200 shadow-xl rounded-[2.5rem] flex flex-col justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Productivity</p>
                        <h3 className="text-5xl font-black text-sky-600">{stats.productivityIndex}%</h3>
                    </div>
                    <div className="mt-4 h-2 w-full bg-sky-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-600 rounded-full" style={{ width: `${stats.productivityIndex}%` }} />
                    </div>
                </Card>

                {/* Task Milestone */}
                <Card className="p-8 bg-slate-900 text-white shadow-2xl rounded-[2.5rem] flex flex-col justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Milestones</p>
                        <div className="flex items-center gap-3">
                            <h3 className="text-5xl font-black">{stats.tasksCompleted}</h3>
                            <FaCheckCircle className="text-emerald-500" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase mt-4">Tasks Completed</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Daily Assignment Checklist */}
                <Card className="lg:col-span-12 p-8 bg-white/60 backdrop-blur-2xl border-sky-200/50 shadow-2xl rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <FaTasks className="text-sky-600" /> Daily Objectives
                        </h2>
                        <span className="text-xs font-black text-sky-600 bg-sky-50 px-4 py-1 rounded-full border border-sky-100">
                            TODAY: {new Date().toLocaleDateString()}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: 'Soil Fertility Test', desc: 'Perform diagnostics on Sector 4A', icon: <FaFlask />, priority: 'High', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
                            { title: 'Inventory Audit', desc: 'Review fertilizer stock levels', icon: <FaBriefcase />, priority: 'Medium', color: 'bg-sky-500/10 text-sky-600 border-sky-500/20' },
                            { title: 'Field Mapping', desc: 'Update coordinates for new crop bed', icon: <FaMapMarkedAlt />, priority: 'Low', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                            { title: 'Safety Protocol', desc: 'Equipment maintenance check', icon: <FaUserShield />, priority: 'Mandatory', color: 'bg-red-500/10 text-red-600 border-red-500/20' }
                        ].map((task, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ scale: 1.01 }}
                                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                        {task.icon}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 leading-tight">{task.title}</p>
                                        <p className="text-xs text-slate-400 font-medium">{task.desc}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${task.color} border`}>
                                    {task.priority}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Emergency / Report Section */}
            <div className="flex items-center justify-between py-6 px-10 bg-red-600 rounded-[2.5rem] shadow-2xl shadow-red-600/20 text-white">
                <div className="flex items-center gap-4">
                    <FaExclamationTriangle size={32} />
                    <div>
                        <p className="text-xl font-black">Field Emergency?</p>
                        <p className="text-red-100 font-medium text-sm">Instantly alert the farm owner and local responders.</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-white text-red-600 rounded-2xl font-black hover:bg-red-50 transition-colors">
                    SIGNAL SOS
                </button>
            </div>
        </div>
    );
};
