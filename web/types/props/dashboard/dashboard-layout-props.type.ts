import * as React from "react";
import type { LucideIcon } from "lucide-react";

export interface DashboardLayoutProps {
  sections: { id: string; label: string; icon: LucideIcon; content: React.ReactNode }[];
  selectedSection: string;
  setSelectedSection: (id: string) => void;
  title: string;
}
