import type { User } from "@/types";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarContentProps {
  isCollapsed: boolean;
  pathname: string;
  user: User | null;
  logout: () => void;
  onItemClick?: () => void;
  navigation: NavigationItem[];
}
