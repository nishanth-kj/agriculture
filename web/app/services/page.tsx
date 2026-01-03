"use client";

import { useEffect, useState } from "react";
import LoginRequired from "@/components/LoginRequired/LoginRequired";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
  FaCloudSun,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaWind,
  FaClock,
  FaLeaf,
  FaFlask,
  FaSeedling,
  FaBug,
  FaChevronDown,
  FaArrowRight
} from "react-icons/fa";

interface WeatherData {
  location: { name: string; region: string };
  current: { temp_c: number; condition: { text: string }; time: string };
}

interface MarketPriceEntry {
  commodity: string;
  value: number;
  state?: string;
  market?: string;
  variety?: string;
  arrival_date?: string;
}

export default function ServicesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPriceEntry[]>([]);
  const [showAllPrices, setShowAllPrices] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/profile", { method: "GET", credentials: "include" });
        if (res.ok) {
          setIsAuthenticated(true);
          fetchClimate();
          fetchPrices();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Authentication failed", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const fetchClimate = async () => {
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
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10");
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
      toast.error("Failed to fetch price data");
    }
  };

  const displayedPrices = showAllPrices ? marketPrices : marketPrices.slice(0, 5);

  return isAuthenticated === null ? (
    <div />
  ) : isAuthenticated === false ? (
    <LoginRequired />
  ) : (
    <section className="relative bg-background py-12">
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* WEATHER */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground mb-6 flex items-center justify-center gap-2">
            <FaCloudSun className="text-blue-500" /> Live Weather Info
          </h2>
          {weather ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base text-center sm:text-left max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <strong>Location:</strong>
                </p>
                <p className="text-muted-foreground truncate pl-6">{weather.location.name}, {weather.location.region}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <FaThermometerHalf className="text-green-600" />
                  <strong>Temperature:</strong>
                </p>
                <p className="text-muted-foreground pl-6">{weather.current.temp_c}°C</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl">
                <p className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <FaWind className="text-amber-600" />
                  <strong>Condition:</strong>
                </p>
                <p className="text-muted-foreground pl-6">{weather.current.condition.text}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <FaClock className="text-purple-600" />
                  <strong>Time:</strong>
                </p>
                <p className="text-muted-foreground truncate pl-6">{weather.current.time}</p>
              </div>
            </div>
          ) : <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}
        </div>

        {/* PRICE TABLE */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8 whitespace-nowrap overflow-hidden text-ellipsis">Market Price Data</h2>
          <div className="overflow-x-auto -mx-6 px-6 scrollbar-hide">
            <div className="min-w-[600px] pb-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">Commodity</TableHead>
                    <TableHead className="font-bold">Price</TableHead>
                    <TableHead className="font-bold">Market</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPrices.map((price, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{price.commodity}</TableCell>
                      <TableCell className="text-green-600 font-bold">₹{price.value.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{price.market}</TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{price.arrival_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {!showAllPrices && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setShowAllPrices(true)}
              >
                View More Market Data
                <FaChevronDown className="ml-2 h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
              </Button>
            </div>
          )}
        </div>

        {/* SMART SERVICES */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 mt-16 px-4 flex items-center justify-center gap-3">
          <FaLeaf className="text-green-600" /> Our Smart Farming Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Soil Health",
              icon: <FaFlask />,
              description: "Monitor and improve soil health for sustainable farming.",
              href: "/services/soil-health",
              bgColor: "bg-amber-50",
            },
            {
              name: "Crop Prediction",
              icon: <FaSeedling />,
              description: "Get precise predictions for crop yields and growth.",
              href: "/services/crop-prediction",
              bgColor: "bg-amber-50",
            },
            {
              name: "Pest Prediction",
              icon: <FaBug />,
              description: "Identify likely pests affecting your crops and get prevention advice.",
              href: "/services/pest-prediction",
              bgColor: "bg-amber-50",
            },
          ].map((service, index) => (
            <div key={index} className={`${service.bgColor} p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md group flex flex-col`}>
              <div className="flex items-start gap-4 h-full">
                <div className="text-3xl p-3 rounded-lg bg-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 text-primary">
                  {service.icon}
                </div>
                <div className="flex-1 flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-foreground mb-2">{service.name}</h2>
                  <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                  <div className="mt-auto">
                    <a href={service.href}
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors">
                      Learn More
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
