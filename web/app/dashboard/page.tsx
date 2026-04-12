"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROLE } from "@/lib";
import LoginRequired from "@/components/common/LoginRequired/LoginRequired";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";

const ROLE_ROUTES: Record<string, string> = {
  [String(ROLE.ADMIN.code)]: "/dashboard/admin",
  [String(ROLE.FARMER.code)]: "/dashboard/farmer",
  [String(ROLE.WORKER.code)]: "/dashboard/worker",
  [String(ROLE.ADMIN.value).toUpperCase()]: "/dashboard/admin",
  [String(ROLE.FARMER.value).toUpperCase()]: "/dashboard/farmer",
  [String(ROLE.WORKER.value).toUpperCase()]: "/dashboard/worker",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const role = user.role;
      if (role) {
        const roleKey = String(role).toUpperCase();
        const route = ROLE_ROUTES[roleKey];
        if (route) {
          router.push(route);
          return;
        }
      }
      // If role is missing or invalid, stay on dashboard root (maybe show error)
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );

  if (!user) return <LoginRequired />;

  // Briefly shown while redirect happens
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="h-12 w-12 bg-muted rounded-2xl" />
      <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">
        Routing to your dashboard...
      </p>
    </div>
  );
}
