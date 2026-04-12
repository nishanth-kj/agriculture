"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SidebarItemProps } from "@/types";

export const SidebarItem = ({
  name,
  href,
  icon: Icon,
  isActive,
  isCollapsed,
  onItemClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onItemClick?.();
      }}
      className={cn(
        "flex items-center rounded-2xl text-sm font-semibold transition-all h-12 duration-300 group",
        isCollapsed ? "justify-center px-0 mx-2" : "px-4 gap-3 mx-1",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      title={isCollapsed ? name : ""}
    >
      <Icon
        className={cn(
          "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
          isActive ? "text-primary-foreground" : "text-muted-foreground",
        )}
      />
      {!isCollapsed && <span className="truncate">{name}</span>}
    </Link>
  );
};
