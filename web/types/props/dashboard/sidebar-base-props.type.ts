import type { User } from "@/types";
import React from "react";

export interface SidebarBaseProps {
  isCollapsed: boolean;
  user: User | null;
  logout: () => void;
  children: React.ReactNode;
}
