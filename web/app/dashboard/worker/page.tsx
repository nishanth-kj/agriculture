"use client";

import { api, ROLE } from "@/lib";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "@/components/common/LoginRequired/LoginRequired";
import { WorkerDashboardProps } from "@/types";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/common/Dashboard/DashboardLayout";

// Import Worker sections
import { WorkerOverview } from "@/components/dashboard/worker/WorkerOverview";

/**
 * [ORCHESTRATOR]
 */
export default function WorkerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<WorkerDashboardProps["stats"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [unauthorized, setUnauthorized] = useState(false);

  // Role-based access control
  useEffect(() => {
    if (!authLoading && user) {
      const userRole = String(user.role).toUpperCase();
      const workerRole = String(ROLE.WORKER.value).toUpperCase();

      if (userRole !== workerRole) {
        setUnauthorized(true);
        // Redirect to appropriate dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    }
  }, [user, authLoading, router]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("api/worker/dashboard").post();
      setStats(data as WorkerDashboardProps["stats"]);
    } catch (err) {
      console.error("Worker stats error:", err);
      setStats({
        assignedFarm: "Not Assigned",
        role: String(user?.role || "Worker"),
        tasksCompleted: 0,
        productivityIndex: 0,
        joinDate: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user && !unauthorized) {
      void fetchStats();
    }
  }, [fetchStats, user, unauthorized]);

  if (authLoading) return null;
  if (!user) return <LoginRequired />;

  if (unauthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 bg-red-200 rounded-2xl" />
        <p className="text-red-600 font-black text-sm uppercase tracking-widest">
          Unauthorized Access
        </p>
        <p className="text-muted-foreground text-xs">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  /**
   * Section Definitions
   */
  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      content: <WorkerOverview stats={stats!} />,
    },
  ];

  if (loading || !stats) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 animate-pulse text-sky-700">
        <div className="h-12 w-12 bg-sky-500 rounded-2xl" />
        <p className="font-black text-xs uppercase tracking-widest">
          Syncing Mission Data...
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout
      sections={sections}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
      title="Field Command"
    />
  );
}
