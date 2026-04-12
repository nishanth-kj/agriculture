'use client';

import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatCard({ label, value, icon, trend, className = '', iconClassName = '' }: StatCardProps) {
  return (
    <Card className={`p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-xl rounded-[2rem] flex flex-col justify-between relative overflow-hidden group ${className}`}>
      {icon && (
        <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform ${iconClassName}`}>
          {icon}
        </div>
      )}
      <div className="relative z-10 space-y-2">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{label}</p>
        <h3 className="text-4xl font-black text-foreground">{value}</h3>
        {trend && (
          <div className={`text-xs font-bold mt-2 ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </div>
        )}
      </div>
    </Card>
  );
}
