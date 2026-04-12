"use client";

import React from "react";
import { Leaf, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarBaseProps } from "@/types";
import { Button } from "@/components/ui/button";

export const SidebarBase = ({
  isCollapsed,
  user,
  logout,
  children,
}: SidebarBaseProps) => {
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header Section */}
      <div
        className={cn(
          "px-6 py-8 flex flex-col",
          isCollapsed ? "items-center px-4" : "items-start",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-black dark:bg-primary p-2.5 rounded-xl text-white shadow-lg flex-shrink-0">
            <Leaf className="w-5 h-5 fill-white/20" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 font-poppins">
              <span className="text-lg font-black tracking-tight text-foreground truncate">
                AgriTech
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {user?.role || "Console"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items (Children) */}
      <div className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar no-scrollbar-on-collapse">
        {children}
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-border mt-auto">
        {user && !isCollapsed && (
          <div className="flex items-center gap-3 px-2 mb-4 animate-in fade-in slide-in-from-left duration-500">
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-primary font-black text-sm border border-border">
              {user.name?.[0] || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-black text-foreground truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-muted-foreground truncate tracking-tight font-medium">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4",
          )}
          title={isCollapsed ? "Logout" : ""}
        >
          <Lock className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Sign Out</span>}
        </Button>

        {!isCollapsed && (
          <div className="mt-4 text-[9px] font-black text-muted-foreground/40 text-center tracking-[0.2em] uppercase">
            Systems Ready • v2.0
          </div>
        )}
      </div>
    </div>
  );
};
