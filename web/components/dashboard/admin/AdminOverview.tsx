"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUp,
  Users as UsersIcon,
  ShieldCheck,
  Activity,
  Globe,
  Cpu,
} from "lucide-react";
import { FaUserSecret, FaGlobe, FaChartBar } from "react-icons/fa";
import { AdminDashboardProps, RoleStat, ROLE } from "@/types";

export default function Overview({ stats }: { stats: AdminDashboardProps["stats"] }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Command</h1>
        <p className="text-muted-foreground mt-1">Enterprise-level overview of users, security, and global assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Authenticated Users", val: stats.totalUsers.toLocaleString(), icon: UsersIcon },
          { label: "Total Resource Value", val: `₹${stats.totalValuation.toLocaleString()}`, icon: TrendingUp },
          { label: "Core API Status", val: stats.systemStatus, icon: ShieldCheck },
          { label: "Active Segments", val: stats.roleDistribution.length.toString(), icon: Activity },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              User Ecosystem
            </CardTitle>
            <CardDescription>Node allocation by user privilege level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.roleDistribution.map((role: RoleStat) => (
                <div key={role.name} className="flex flex-col items-center p-4 rounded-lg border bg-muted/30 hover:bg-accent transition-colors text-center group">
                  <div className="p-3 bg-background rounded-md mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {role.name === ROLE.ADMIN.value && <FaUserSecret size={20} />}
                    {role.name === ROLE.FARMER.value && <FaGlobe size={20} />}
                    {role.name === ROLE.WORKER.value && <FaChartBar size={20} />}
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{role.name}</p>
                  <p className="text-3xl font-bold">{role.count}</p>
                </div>
              ))}
              {stats.roleDistribution.length === 0 && (
                <div className="col-span-3 py-10 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  No segments detected
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Diagnostics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Kernel Diagnostics
            </CardTitle>
            <CardDescription>System telemetry and core health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">System Load</span>
                <span className="text-sm font-bold text-primary">24%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Latency</p>
                <p className="text-xl font-bold">12ms</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Uptime</p>
                <p className="text-xl font-bold">99.9%</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>DEPLOYMENT: V2.4.0</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
