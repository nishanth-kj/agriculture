"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Leaf, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

import { DashboardLayoutProps } from "@/types";
import { SidebarItem } from "./SidebarItem";

export function DashboardLayout({
  sections,
  selectedSection,
  setSelectedSection,
  title,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeSection =
    sections.find((s) => s.id === selectedSection) || sections[0];

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header */}
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
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-black tracking-tight text-foreground truncate">
                AgriTech
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        {sections.map((section) => (
          <SidebarItem
            key={section.id}
            name={section.label}
            href="#"
            icon={section.icon}
            isActive={selectedSection === section.id}
            isCollapsed={isCollapsed}
            onItemClick={() => {
              setSelectedSection(section.id);
              onItemClick?.();
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        {user && !isCollapsed && (
          <div className="flex items-center gap-3 px-2 mb-4 animate-in fade-in slide-in-from-left duration-500">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-sm">
              {user.name?.[0] || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-foreground truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-muted-foreground truncate tracking-tight">
                {String(user.role) || "Member"}
              </span>
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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Floating Sidebar */}
      <div className="hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-64px)] py-5 pl-5 z-20">
        <aside
          className={cn(
            "bg-card border border-border rounded-[32px] flex flex-col transition-all duration-500 ease-in-out relative shadow-sm overflow-hidden",
            "h-[calc(100vh-100px)]",
            isCollapsed ? "w-[76px]" : "w-[260px]",
          )}
        >
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
          <SidebarContent />
        </aside>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-auto flex flex-col transition-all duration-500 ease-in-out",
          isCollapsed ? "md:ml-[116px]" : "md:ml-[300px]",
        )}
      >
        {/* Mobile Floating Menu - Polished */}
        <div className="md:hidden fixed left-6 bottom-10 z-[100] flex flex-col items-start gap-3">
          {/* Menu Items */}
          <div
            className={cn(
              "flex flex-col gap-3 transition-all duration-300 origin-bottom",

              // SCROLL FIX
              "max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar",

              isMobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none",
            )}
          >
            {sections.map((section) => {
              const isActive = selectedSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all duration-300",

                    // LIGHT MODE
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                      : "bg-white/70 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900",

                    // DARK MODE
                    "dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white",
                    isActive &&
                      "dark:bg-white dark:text-black dark:border-white dark:shadow-white/20",
                  )}
                >
                  <section.icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:scale-110",
                    )}
                  />

                  <span className="text-sm font-bold tracking-tight">
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Floating Button */}
          <Button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-2xl",

              // LIGHT
              "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30",

              // DARK
              "dark:bg-white dark:text-black dark:hover:bg-white/90 dark:shadow-white/20",
            )}
          >
            {isMobileOpen ? (
              <X className="w-6 h-6 transition-all duration-300 rotate-90 scale-110" />
            ) : (
              <Menu className="w-6 h-6 transition-all duration-300" />
            )}
          </Button>
        </div>
        <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeSection.content}
        </div>
      </main>
    </div>
  );
}
