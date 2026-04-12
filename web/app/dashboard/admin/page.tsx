"use client";

import { api } from "@/lib";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROLE } from "@/lib";
import LoginRequired from "@/components/common/LoginRequired/LoginRequired";
import { AdminDashboardProps } from "@/types";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/common/Dashboard/DashboardLayout";

// Consolidated Admin sections via index barrel
import Overview from "@/components/dashboard/admin/AdminOverview";

/**
 * [ORCHESTRATOR]
 */
export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminDashboardProps["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [unauthorized, setUnauthorized] = useState(false);

  // Role-based access control
  useEffect(() => {
    if (!authLoading && user) {
      const userRole = String(user.role).toUpperCase();
      const adminRole = String(ROLE.ADMIN.value).toUpperCase();

      if (userRole !== adminRole) {
        setUnauthorized(true);
        // Redirect to appropriate dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api("api/admin/dashboard").post();
      setStats({
        totalUsers: 0,
        totalValuation: 0,
        systemStatus: "Operational",
        roleDistribution: [],
        ...data,
      });
    } catch (err) {
      console.error("Admin stats error:", err);
      setStats({
        totalUsers: 0,
        totalValuation: 0,
        systemStatus: "Degraded",
        roleDistribution: [],
      });
    } finally {
      setLoading(false);
    }
  };

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
      content: <Overview stats={stats!} />,
    },
  ];

  if (loading || !stats) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="h-12 w-12 bg-slate-900 rounded-2xl" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
          Syncing Alpha Node...
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout
      sections={sections}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
      title="Admin Command"
    />
  );
}
