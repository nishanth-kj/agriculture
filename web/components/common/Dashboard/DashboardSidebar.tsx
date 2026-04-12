"use client"

import * as React from "react"
import { LogOut, Leaf } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { DashboardLayoutProps } from "@/types"

export function DashboardSidebar({
  sections,
  selectedSection,
  setSelectedSection,
  title,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 bg-white shadow-2xl">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
            <Leaf className="w-5 h-5 fill-emerald-400 text-emerald-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">
                AgriTech
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                {title.replace(" Command", "") || "Protocol"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-3">
            Navigation Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={selectedSection === section.id}
                    onClick={() => setSelectedSection(section.id)}
                    tooltip={section.label}
                    className="h-12 rounded-2xl group relative transition-all duration-300"
                  >
                    <button
                      className={`flex items-center w-full px-4 transition-all duration-300 ${
                        selectedSection === section.id
                          ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <section.icon
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                          selectedSection === section.id ? "text-emerald-400" : ""
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="ml-3 font-bold text-sm truncate">
                          {section.label}
                        </span>
                      )}
                      {selectedSection === section.id && !isCollapsed && (
                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className={`flex flex-col gap-4 ${isCollapsed ? "items-center" : ""}`}>
          {!isCollapsed && user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-bottom-2 duration-500">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg">
                {user.name?.[0] || "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-black text-slate-900 truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">
                  {user.role} Node
                </span>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`flex items-center h-12 rounded-2xl transition-all duration-300 group ${
              isCollapsed 
                ? "w-12 justify-center bg-rose-50 text-rose-500 hover:bg-rose-100" 
                : "px-4 gap-3 w-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10"
            }`}
          >
            <LogOut className={`w-5 h-5 transition-transform group-hover:rotate-12 ${isCollapsed ? "" : "text-rose-400"}`} />
            {!isCollapsed && <span className="font-bold text-sm">Terminate Session</span>}
          </button>
          
          {!isCollapsed && (
            <div className="text-[9px] font-black text-slate-300 text-center tracking-[0.3em] uppercase pt-2">
              System Ready • v2.4
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
