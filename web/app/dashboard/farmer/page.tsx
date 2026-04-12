"use client";

import { api, ROLE } from "@/lib";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "@/components/common/LoginRequired/LoginRequired";
import { FarmerDashboardProps, WeatherData, MarketPriceEntry } from "@/types";
import dayjs from "dayjs";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Package, 
  FlaskConical, 
  Sprout, 
  Bug,
} from "lucide-react";
import { DashboardLayout } from "@/components/common/Dashboard/DashboardLayout";

// Import Farmer sections individually
import {
  FarmerOverview,
  SoilHealthView,
  CropPredictionView,
  PestPredictionView,
  ManagingView,
} from "@/components/dashboard/farmer";


/**
 * [ORCHESTRATOR]
 */
export default function FarmerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Data State
  const [stats, setStats] = useState<FarmerDashboardProps["stats"] | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPriceEntry[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [unauthorized, setUnauthorized] = useState(false);

  // Role-based access control
  useEffect(() => {
    if (!authLoading && user) {
      const userRole = String(user.role).toUpperCase();
      const farmerRole = String(ROLE.FARMER.value).toUpperCase();
      
      if (userRole !== farmerRole) {
        setUnauthorized(true);
        // Redirect to appropriate dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    }
  }, [user, authLoading, router]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api("api/farmer/dashboard").post();
      setStats(data as FarmerDashboardProps["stats"]);
    } catch (err) {
      console.error("Farmer stats error:", err);
      setStats({
        revenue: 0,
        cost: 0,
        profit: 0,
        inventoryCount: 0,
        labourCount: 0,
      });
    }
  }, []);

  const fetchClimate = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const data = await res.json();
          const time = data.current_weather.time;
          setWeather({
            location: { name: `Lat: ${lat.toFixed(2)}`, region: `Lon: ${lon.toFixed(2)}` },
            current: {
              temp_c: data.current_weather.temperature,
              condition: { text: `Wind: ${data.current_weather.windspeed} km/h` },
              time: dayjs(time).format('MMMM D, YYYY h:mm A')
            }
          });
        } catch {
          toast.error("Failed to fetch weather data");
        }
      });
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    try {
      const DATA_GOV_API_KEY = process.env.NEXT_PUBLIC_DATA_GOV_API_KEY;
      if (!DATA_GOV_API_KEY) return;
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(DATA_GOV_API_KEY)}&format=json&limit=10`;
      const res = await fetch(url);
      const data = await res.json();
      const prices: MarketPriceEntry[] = data.records.map((entry: Record<string, string>) => ({
        commodity: entry["commodity"],
        value: parseFloat(entry["modal_price"] || entry["min_price"] || "0"),
        state: entry["state"],
        market: entry["market"],
        variety: entry["variety"],
        arrival_date: entry["arrival_date"]
      }));
      setMarketPrices(prices);
    } catch {
      console.error("Failed to fetch price data");
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchClimate(),
      fetchPrices()
    ]);
    setLoading(false);
  }, [fetchClimate, fetchPrices, fetchStats]);

  useEffect(() => {
    if (user && !unauthorized) {
      void fetchAllData();
    }
  }, [fetchAllData, user, unauthorized]);

  if (authLoading) return null;
  if (!user) return <LoginRequired />;

  if (unauthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 bg-red-200 rounded-2xl" />
        <p className="text-red-600 font-black text-sm uppercase tracking-widest">
          Unauthorized Access
        </p>
        <p className="text-muted-foreground text-xs">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  /**
   * Section Definitions
   */
  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, content: <FarmerOverview stats={stats!} weather={weather} marketPrices={marketPrices} showAllPrices={showAllPrices} setShowAllPrices={setShowAllPrices} onToolSelect={setSelectedSection} /> },
    { id: "inventory", label: "Inventory", icon: Package, content: <ManagingView initialTab="inventory" hideTabs={false} /> },
    { id: "soil", label: "Soil Health", icon: FlaskConical, content: <SoilHealthView /> },
    { id: "crop", label: "Crop AI", icon: Sprout, content: <CropPredictionView /> },
    { id: "pest", label: "Pest Forecast", icon: Bug, content: <PestPredictionView /> },
  ];

  if (loading || !stats) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 animate-pulse text-green-700">
        <div className="h-12 w-12 bg-green-500 rounded-2xl" />
        <p className="font-black text-xs uppercase tracking-widest">
          Syncing Farm Hub...
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout
      sections={sections}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
      title="Farmer Portal"
    />
  );
}
