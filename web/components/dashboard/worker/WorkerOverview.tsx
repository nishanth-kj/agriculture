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
  FaTasks,
  FaIdCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBriefcase,
  FaUserShield,
  FaFlask,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { Activity } from "lucide-react";
import { WorkerDashboardProps } from "@/types";

export function WorkerOverview({ stats }: WorkerDashboardProps) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Field Operations</h1>
        <p className="text-muted-foreground mt-1">Your active mission, task status, and operational toolkit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Duty</CardTitle>
            <FaIdCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold uppercase">{stats.role}</div>
            <p className="text-sm text-muted-foreground">
              Assigned to: <span className="font-semibold text-foreground">{stats.assignedFarm}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productivityIndex}%</div>
            <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${stats.productivityIndex}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <FaCheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FaTasks className="h-4 w-4" /> Daily Objectives
            </CardTitle>
            <CardDescription>Track today&apos;s assignments and progress</CardDescription>
          </div>
          <div className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md">
            {new Date().toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "Soil Fertility Test", desc: "Perform diagnostics on Sector 4A", icon: <FaFlask />, priority: "High" },
              { title: "Inventory Audit", desc: "Review fertilizer stock levels", icon: <FaBriefcase />, priority: "Medium" },
              { title: "Field Mapping", desc: "Update coordinates for new crop bed", icon: <FaMapMarkedAlt />, priority: "Low" },
              { title: "Safety Protocol", desc: "Equipment maintenance check", icon: <FaUserShield />, priority: "Required" },
            ].map((task, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-muted rounded-md text-muted-foreground">{task.icon}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.desc}</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase rounded w-fit shrink-0">
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <FaExclamationTriangle className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-destructive">Field Emergency?</h3>
              <p className="text-sm text-destructive/80">Instantly alert the farm owner and local responders.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-destructive text-destructive-foreground font-semibold rounded-md hover:bg-destructive/90 transition-colors w-full sm:w-auto shrink-0">
            SIGNAL SOS
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
