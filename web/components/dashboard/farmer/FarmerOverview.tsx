"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  TrendingUp,
  Wallet,
  Package,
  Users as UsersIcon,
  Sun,
  MapPin,
  ChevronDown
} from "lucide-react";
import { FarmerDashboardViewProps } from "@/types";

export default function FarmerOverview({
  stats,
  weather,
  marketPrices,
  showAllPrices,
  setShowAllPrices,
  onToolSelect
}: FarmerDashboardViewProps & { onToolSelect?: (id: string) => void }) {
  if (!stats) return null;

  const displayedPrices = showAllPrices ? marketPrices : marketPrices.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Farm Command Centre</h1>
        <p className="text-muted-foreground mt-1">Manage operations, monitor climate, and track market value.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Net Revenue", val: `₹${(stats.revenue || 0).toLocaleString()}`, icon: TrendingUp },
          { label: "Total Costs", val: `₹${(stats.cost || 0).toLocaleString()}`, icon: Wallet },
          { label: "Inventory", val: stats.inventoryCount || 0, icon: Package },
          { label: "Labour Force", val: stats.labourCount || 0, icon: UsersIcon },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              Local Climate Forecast
            </CardTitle>
            {weather && (
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {weather.location.name}, {weather.location.region}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {weather ? (
              <div className="space-y-4">
                <div className="text-4xl font-bold">{weather.current.temp_c}°C</div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Condition</p>
                    <p className="font-semibold">{weather.current.condition.text}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Updated</p>
                    <p className="font-semibold text-sm">{weather.current.time}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 flex text-sm text-muted-foreground items-center justify-center animate-pulse">
                Locating Field Sensor...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Intelligence</CardTitle>
            <CardDescription>Live NCDEX tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Min Price</TableHead>
                  <TableHead>Market</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPrices.map((price, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{price.commodity}</TableCell>
                    <TableCell>₹{price.value.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{price.market}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!showAllPrices && marketPrices.length > 5 && (
              <button
                onClick={() => setShowAllPrices && setShowAllPrices(true)}
                className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View More <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight">Precision Agriculture Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "soil", name: "Soil Health", icon: "🧪", desc: "Chemical diagnostics & AI classification." },
            { id: "crop", name: "Crop AI", icon: "🌾", desc: "Predict yield based on soil & climate data." },
            { id: "pest", name: "Pest Forecast", icon: "🐛", desc: "Early warning system for infestations." },
          ].map((service, i) => (
            <Card
              key={i}
              className="group cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onToolSelect && onToolSelect(service.id)}
            >
              <CardHeader>
                <div className="text-3xl mb-2">{service.icon}</div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
