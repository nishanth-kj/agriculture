import { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
  onItemClick?: () => void;
}
